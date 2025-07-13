import express from 'express'
import usersRouter from '~/routers/users.routers'
const app = express()

const PORT = process.env.PORT || 3000

// Middleware để parse JSON
app.use(express.json())

app.use('/users', usersRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
