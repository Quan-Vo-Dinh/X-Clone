import { TokenType } from '~/constants/enum'
import { RegisterRequestBody } from '~/models/requests/User.request'
import { User } from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import ms, { StringValue } from 'ms'

class UsersService {
  private signAccessToken(user_id: string): Promise<string> {
    return signToken({
      payload: { user_id: user_id, token_type: TokenType.AccessToken },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  private signRefreshToken(user_id: string): Promise<string> {
    return signToken({
      payload: { user_id: user_id, token_type: TokenType.RefreshToken },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue
      }
    })
  }

  async register(payload: RegisterRequestBody) {
    console.log('hashPassword:', hashPassword(payload.password))
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])

    return {
      access_token,
      refresh_token
    }
  }

  async checkEmailService(email: string) {
    const user = await databaseService.users.findOne({ email })
    console.log('Checking email: ', email)
    console.log('User found: ', user)
    return Boolean(user)
  }
}

const usersService = new UsersService()
export default usersService
