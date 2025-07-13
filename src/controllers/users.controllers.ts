import { Request, Response } from 'express'
import usersService from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  console.log('Login request received:', req.body)
  const { email, password } = req.body
  if (email === 'vodinhquan2707.it@gmail.com' && password === '123123') {
    res.json({ message: 'Login successful', user: { email: req.body.email } })
  }
  return res.status(401).json({ error: 'Invalid email or password' })
}

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await usersService.register({ email, password })
    if (result.acknowledged) {
      return res.status(201).json({ message: 'User registered successfully', userId: result.insertedId })
    } else {
      return res.status(500).json({ error: 'Failed to register user' })
    }
  } catch (error) {
    return res.status(400).json({ error: 'An error occurred while registering user' })
  }
}
