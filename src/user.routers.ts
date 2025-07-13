import { Request, Response, NextFunction, Router } from 'express'
const userRouter = Router()

const middleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`)
  console.log('Timestamp:', new Date().toISOString())
  next()
}

userRouter.use(middleware)

userRouter.get('/posts', (req, res) => {
  res.json({
    data: [{ id: 1, title: 'Post 1', content: 'Content of Post 1' }]
  })
})

export default userRouter
