import { Request, Response } from 'express'
import usersService from '~/services/users.services'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { RegisterRequestBody } from '~/models/requests/User.request'

export const loginController = (req: Request, res: Response) => {
  console.log('Login request received:', req.body)
  const { email, password } = req.body
  if (email === 'vodinhquan2707.it@gmail.com' && password === '123123') {
    return res.json({ message: 'Login successful', user: { email: req.body.email } })
  }
  return res.status(401).json({ error: 'Invalid email or password' })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.register(req.body)
  return res.status(201).json({ message: 'User registered successfully', result: result })
}
