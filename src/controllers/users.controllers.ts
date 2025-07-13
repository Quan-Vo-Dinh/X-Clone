import { Request, Response } from 'express'

export const loginController = (req: Request, res: Response) => {
  console.log('Login request received:', req.body)
  const { email, password } = req.body
  if (email === 'vodinhquan2707.it@gmail.com' && password === '123123') {
    res.json({ message: 'Login successful', user: { email: req.body.email } })
  }
  return res.status(401).json({ error: 'Invalid email or password' })
}
