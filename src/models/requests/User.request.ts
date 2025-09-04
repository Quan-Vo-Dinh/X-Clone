import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enum'

export interface RegisterRequestBody {
  email: string
  password: string
  confirm_password: string
  name: string
  date_of_birth: Date
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}

export interface LogoutRequestBody {
  refresh_token: string
}
