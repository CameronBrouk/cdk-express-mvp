const express = require('express')
const dotenv = require('dotenv')
const env = dotenv.config().parsed

const app = express()

app.use(express.json())

app.listen(env.PORT, () => {
  console.log(`Listening on Port ${env.PORT}`)
})

app.get('/', (req, res) => {
  console.log("Received Request '/'")
  res.sendStatus(200)
  console.log("Complete Request '/'")
})

app.get('/ping', (req, res) => {
  console.log("Received Request '/ping'")
  res.status(200).send('pong')
  console.log("Completed Request '/ping'")
})

app.get('/fuck', (req, res) => {
  console.log("Received Request '/fuck'")
  res.status(200).send('you')
  console.log("Completed Request '/fuck'")
})

app.get('/health', (req, res) => {
  console.log("Received Request '/health'")
  res.sendStatus(200)
  console.log("Completed Request '/health'")
})
