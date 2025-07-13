import express from 'express'
import { Request, Response, NextFunction } from 'express'
import userRouter from '~/user.routers'
const app = express()
const router = express.Router()

const PORT = process.env.PORT || 3000

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Express!')
})

app.use('/user  ', userRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
