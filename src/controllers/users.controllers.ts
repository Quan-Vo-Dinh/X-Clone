import { Request, Response } from 'express'
import usersService from '~/services/users.services'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { RegisterRequestBody } from '~/models/requests/User.request'

export const loginController = (req: Request, res: Response) => {
  console.log('Login request received:', req.body)
  const { email, password } = req.body
  if (email === 'vodinhquan2707.it@gmail.com' && password === '123123') {
    return res.json({ message: 'Login successful', user: { emaeil: req.body.email } })
  }
  return res.status(401).json({ error: 'Invalid email or password' })
}

/*
- ParamsDictionary: Kiểu của các tham số trong URL, thường là một đối tượng với các khóa là tên tham số và giá trị là giá trị của tham số đó.
- any: Kiểu của dữ liệu trả về, có thể là bất kỳ kiểu dữ liệu nào.
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
