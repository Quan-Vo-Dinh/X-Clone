import express from 'express'
import usersRouter from '~/routers/users.routers'
import databaseService from '~/services/database.services'
import { Request, Response, NextFunction } from 'express'

const app = express()
const router = express.Router()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use('/users', usersRouter)
databaseService.connect()

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('loi roi', err.message)
  res.status(400).json({ error: err.message })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
