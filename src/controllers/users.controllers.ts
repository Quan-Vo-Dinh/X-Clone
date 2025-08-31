import { Request, Response } from 'express'
import usersService from '~/services/users.services'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { RegisterRequestBody } from '~/models/requests/User.request'
import { User } from '~/models/schemas/User.schema'
import { ObjectId } from 'mongodb'

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login(user_id.toString())
  return res.status(200).json({ message: 'User logged in successfully', result: result })
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
  return res.status(201).json({ message: 'User registered successfully', result: result })
}
