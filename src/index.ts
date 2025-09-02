import express from 'express'
import usersRouter from '~/routers/users.routers'
import databaseService from '~/services/database.services'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import { config } from 'dotenv'

config()

databaseService.connect()

const app = express()
const router = express.Router()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use('/users', usersRouter)

app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
