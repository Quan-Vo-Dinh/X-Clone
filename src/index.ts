import express from 'express'
import usersRouter from '~/routers/users.routes'
import databaseService from '~/services/database.services'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import { config } from 'dotenv'
import mediasRouter from './routers/medias.routes'
import { initFolder } from './utils/file'

config()

databaseService.connect()

const app = express()
const router = express.Router()

const PORT = process.env.PORT || 3000

// Khởi tạo thư mục lưu trữ file nếu chưa tồn tại
initFolder('uploads/images')

app.use(express.json())
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)

app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
