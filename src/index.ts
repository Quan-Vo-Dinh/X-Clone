import express from 'express'
import { Request, Response, NextFunction } from 'express'
import usersRouter from '~/routers/users.routers'
import databaseService from '~/services/database.services'

const app = express()
const router = express.Router()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use('/users', usersRouter)
databaseService.connect()

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
