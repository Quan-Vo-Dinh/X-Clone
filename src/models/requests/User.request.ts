import { ParamsDictionary } from 'express-serve-static-core'
import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enum'
import { UserVerifyStatus } from '~/models/schemas/User.schema'

export interface LoginRequestBody {
  email: string
  password: string
}

export interface RegisterRequestBody {
  email: string
  password: string
  confirm_password: string
  name: string
  date_of_birth: Date
}

export interface VerifyEmailRequestBody {
  email_verify_token: string
}
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
}

export interface LogoutRequestBody {
  refresh_token: string
}

export interface ForgotPasswordRequestBody {
  email: string
}

export interface VerifyForgotPasswordRequestBody {
  forgot_password_token: string
}

export interface ResetPasswordRequestBody {
  forgot_password_token: string
  new_password: string
  confirm_password: string
}

export interface UpdateMeRequestBody {
  name?: string
  email?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export interface FollowRequestBody {
  followed_user_id: string
}

export interface UnfollowRequestParams extends ParamsDictionary {
  user_id: string
}
