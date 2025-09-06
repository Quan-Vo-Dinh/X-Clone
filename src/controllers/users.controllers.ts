import { body } from 'express-validator'
import { Request, Response } from 'express'
import usersService from '~/services/users.services'
import { NextFunction, ParamsDictionary, RequestHandler } from 'express-serve-static-core'
import {
  ForgotPasswordRequestBody,
  LoginRequestBody,
  LogoutRequestBody,
  RegisterRequestBody,
  ResetPasswordRequestBody,
  TokenPayload,
  VerifyEmailRequestBody,
  VerifyForgotPasswordRequestBody
} from '~/models/requests/User.request'
import { User, UserVerifyStatus } from '~/models/schemas/User.schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { HTTP_STATUS } from '~/constants/httpStatus'

export const loginController = async (
  req: Request<ParamsDictionary, any, LoginRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login(user_id.toString())
  return res.status(HTTP_STATUS.OK).json({ message: USERS_MESSAGES.LOGIN_SUCCESS, result: result })
}

/*
- ParamsDictionary: Kiểu của các tham số trong URL, thường là một đối tượng với các khóa là tên tham số và giá trị là giá trị của tham số đó.
- any: Kiểu của dữ liệu trả về, có thể là bất kỳ kiểu dữ liệu nào.
- RegisterRequestBody: Kiểu của dữ liệu yêu cầu, thường là một đối tượng chứa thông tin đăng ký người dùng.

note: việc định nghĩa lại type này sẽ chỉ tác động đến req.params (theo ParamsDictionary), req.body (theo RegisterRequestBody) và req.query (theo any) trong hàm registerController.

*/

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.register(req.body)
  return res.status(HTTP_STATUS.CREATED).json({ message: USERS_MESSAGES.REGISTER_SUCCESS, result: result })
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  const result = await usersService.logout(refresh_token)
  return res.status(HTTP_STATUS.OK).json({ message: result.message })
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, VerifyEmailRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

  // Nếu không tìm thấy user thì trả về lỗi
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: USERS_MESSAGES.USER_NOT_FOUND })
  }

  // Đã verify rồi thì không báo lỗi
  // Mà sẽ trả về với status OK với message là đã verify trước đó rồi
  if (user.email_verify_token === '') {
    return res.status(HTTP_STATUS.OK).json({ message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED })
  }
  const result = await usersService.verifyEmail(user_id)
  if (result) {
    return res.status(HTTP_STATUS.OK).json({ message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS, result: result })
  }
}

export const resendVerifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: USERS_MESSAGES.USER_NOT_FOUND })
  }
  if (user.verify === UserVerifyStatus.Verified) {
    return res.status(HTTP_STATUS.OK).json({ message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED })
  }
  const result = await usersService.resendVerifyEmail(user_id)
  return res.status(HTTP_STATUS.OK).json(result)
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id } = req.user as User
  const result = await usersService.forgotPassword((_id as ObjectId).toString())
  return res.status(HTTP_STATUS.OK).json({ message: result.message })
}

export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  return res.status(HTTP_STATUS.OK).json({ message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { new_password } = req.body
  const result = await usersService.resetPassword(user_id, new_password)
  return res.status(HTTP_STATUS.OK).json({ message: result.message })
}

export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await usersService.getMe(user_id)
  return res.status(HTTP_STATUS.OK).json({ message: USERS_MESSAGES.GET_PROFILE_SUCCESS, result: result })
}
