require('dotenv').config()

const express = require('express')
const cors = require('cors')

const authRoutes = require('./src/routes/auth.routes')
const tasksRoutes = require('./src/routes/tasks.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API funcionando')
})

app.use('/auth', authRoutes)
app.use('/tasks', tasksRoutes)

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})