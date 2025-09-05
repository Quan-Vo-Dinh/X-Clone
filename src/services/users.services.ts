import { TokenType } from '~/constants/enum'
import { RegisterRequestBody } from '~/models/requests/User.request'
import { User, UserVerifyStatus } from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import ms, { StringValue } from 'ms'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'
import { USERS_MESSAGES } from '~/constants/messages'

config()

class UsersService {
  constructor() {
    // Debug biến môi trường
    console.log('🔍 ENV DEBUGGING:')
    console.log('JWT_ACCESS_SECRET:', process.env.JWT_ACCESS_SECRET ? '✅ EXISTS' : '❌ MISSING')
    console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET ? '✅ EXISTS' : '❌ MISSING')
    console.log('JWT_EMAIL_VERIFY_SECRET:', process.env.JWT_EMAIL_VERIFY_SECRET ? '✅ EXISTS' : '❌ MISSING')
    console.log('ACCESS_TOKEN_EXPIRES_IN:', process.env.ACCESS_TOKEN_EXPIRES_IN || '❌ MISSING')
    console.log('REFRESH_TOKEN_EXPIRES_IN:', process.env.REFRESH_TOKEN_EXPIRES_IN || '❌ MISSING')
    console.log('EMAIL_VERIFY_TOKEN_EXPIRES_IN:', process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN || '❌ MISSING')
  }
  private signAccessToken(user_id: string): Promise<string> {
    return signToken({
      payload: { user_id: user_id, token_type: TokenType.AccessToken },
      privateKey: process.env.JWT_ACCESS_SECRET as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  private signRefreshToken(user_id: string): Promise<string> {
    return signToken({
      payload: { user_id: user_id, token_type: TokenType.RefreshToken },
      privateKey: process.env.JWT_REFRESH_SECRET as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  private signEmailVerifyToken(user_id: string): Promise<string> {
    return signToken({
      payload: { user_id: user_id, token_type: TokenType.EmailVerifyToken },
      privateKey: process.env.JWT_EMAIL_VERIFY_SECRET as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  private signAccessAndRefreshToken(user_id: string): Promise<[string, string]> {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async register(payload: RegisterRequestBody) {
    const user_id = new ObjectId()

    const email_verify_token = await this.signEmailVerifyToken(user_id.toString())
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password),
        email_verify_token,
        verify: UserVerifyStatus.Unverified
      })
    )

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id.toString())

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id)
      })
    )

    // mô phỏng gửi email
    console.log(`Email verify token: ${email_verify_token}`)

    return {
      access_token,
      refresh_token
    }
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id)
      })
    )

    return { access_token, refresh_token }
  }

  async logout(refresh_token: string) {
    const result = await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    console.log(result)
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    }
  }

  async checkEmailService(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  async verifyEmail(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { email_verify_token: '', verify: UserVerifyStatus.Verified },
        $currentDate: { updated_at: true }
      }
    )

    return {
      access_token,
      refresh_token
    }
  }

  async resendVerifyEmail(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken(user_id)

    // chưa implement tính năng gửi email
    console.log('Resend email verify token:', email_verify_token)

    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { email_verify_token: email_verify_token },
        $currentDate: { updated_at: true }
      }
    )

    return {
      message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS
    }
  }
}

const usersService = new UsersService()
export default usersService
