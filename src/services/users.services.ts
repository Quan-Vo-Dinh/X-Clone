import { TokenType } from '~/constants/enum'
import { RegisterRequestBody, UpdateMeRequestBody } from '~/models/requests/User.request'
import { User, UserVerifyStatus } from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import ms, { StringValue } from 'ms'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { Follower } from '~/models/schemas/Follower.schema'

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
  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }): Promise<string> {
    return signToken({
      payload: { user_id: user_id, token_type: TokenType.AccessToken, verify: verify },
      privateKey: process.env.JWT_ACCESS_SECRET as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  private signRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }): Promise<string> {
    return signToken({
      payload: { user_id: user_id, token_type: TokenType.RefreshToken, verify: verify },
      privateKey: process.env.JWT_REFRESH_SECRET as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }): Promise<string> {
    return signToken({
      payload: { user_id: user_id, token_type: TokenType.EmailVerifyToken, verify: verify },
      privateKey: process.env.JWT_EMAIL_VERIFY_SECRET as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }): Promise<string> {
    return signToken({
      payload: { user_id: user_id, token_type: TokenType.ForgotPasswordToken, verify: verify },
      privateKey: process.env.JWT_FORGOT_PASSWORD_SECRET as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  private signAccessAndRefreshToken({
    user_id,
    verify
  }: {
    user_id: string
    verify: UserVerifyStatus
  }): Promise<[string, string]> {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  async register(payload: RegisterRequestBody) {
    const user_id = new ObjectId()

    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
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

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })

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

  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({ user_id, verify })
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
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      verify: UserVerifyStatus.Verified
    })
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
    const email_verify_token = await this.signEmailVerifyToken({
      user_id,
      verify: UserVerifyStatus.Unverified
    })

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
  async forgotPassword({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify })
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: { forgot_password_token, updated_at: '$$NOW' }
      }
    ])

    // chưa implement tính năng gửi email (Gửi email kèm đường link đến email người dùng, đường link này sẽ có dạng: `https://myapp.com/reset-password?token=<forgot_password_token>)
    console.log('Forgot password token:', forgot_password_token)

    return {
      message: USERS_MESSAGES.CHECK_YOUR_EMAIL_FOR_RESET_PASSWORD
    }
  }

  async resetPassword(user_id: string, new_password: string) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { password: hashPassword(new_password), forgot_password_token: '' },
        $currentDate: { updated_at: true }
      }
    )
    return {
      message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS
    }
  }

  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      { projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } }
    )
    return user
  }

  async updateMe(user_id: string, payload: UpdateMeRequestBody) {
    const updatePayload: any = {
      ...payload
    }

    if (payload.date_of_birth) {
      updatePayload.date_of_birth = new Date(payload.date_of_birth)
    }

    const result = await databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: updatePayload,
        $currentDate: { updated_at: true }
      },
      {
        returnDocument: 'after',
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )

    if (!result) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return result
  }

  async follow(user_id: string, followed_user_id: string) {
    if (user_id === followed_user_id) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.CANNOT_FOLLOW_YOURSELF,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    // Kiểm tra xem đã follow chưa
    const existingFollow = await databaseService.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    if (existingFollow) {
      return {
        message: USERS_MESSAGES.FOLLOWED
      }
    }

    await databaseService.followers.insertOne(
      new Follower({
        user_id: new ObjectId(user_id),
        followed_user_id: new ObjectId(followed_user_id),
        created_at: new Date()
      })
    )
    return {
      message: USERS_MESSAGES.FOLLOW_SUCCESS
    }
  }

  async unfollow(user_id: string, followed_user_id: string) {
    if (user_id === followed_user_id) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.CANNOT_UNFOLLOW_YOURSELF,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    const existingFollow = await databaseService.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    if (!existingFollow) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.NOT_FOLLOWED_YET,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    await databaseService.followers.deleteOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    return {
      message: USERS_MESSAGES.UNFOLLOW_SUCCESS
    }
  }
}

const usersService = new UsersService()
export default usersService
