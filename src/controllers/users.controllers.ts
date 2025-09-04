import { Request, Response } from 'express'
import usersService from '~/services/users.services'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { LogoutRequestBody, RegisterRequestBody } from '~/models/requests/User.request'
import { User } from '~/models/schemas/User.schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login(user_id.toString())
  return res.status(200).json({ message: USERS_MESSAGES.LOGIN_SUCCESS, result: result })
}

/*
- ParamsDictionary: Kiểu của các tham số trong URL, thường là một đối tượng với các khóa là tên tham số và giá trị là giá trị của tham số đó.s
- any: Kiểu của dữ liệu trả về, có th    "email": "vodinhquan2707.it@gmmail.com",ể là bất kỳ kiểu dữ liệu nào.
- RegisterRequestBody: Kiểu của dữ liệu yêu cầu, thường là một đối tượng chứa thông tin đăng ký người dùng.

note: việc định nghĩa lại type này sẽ chri tác động đến req.params (theo ParamsDictionary), req.body (theo RegisterRequestBody) và req.query (theo any) trong hàm registerController.

*/

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.register(req.body)
  return res.status(201).json({ message: USERS_MESSAGES.REGISTER_SUCCESS, result: result })
}
export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  const result = await usersService.logout(refresh_token)
  return res.status(200).json({ message: result.message })
}
