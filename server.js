const express = require('express')
const app = express()
const { urlencoded, json } = require('body-parser')
const { sendIndexPage, submitData, getResult } = require('./service')
const PORT = process.env.PORT || 5000

app.use(urlencoded({ extended: false }))
app.use(json())

app
  .get('/', sendIndexPage)
  .post('/secret', submitData)
  .get('/result/:name', getResult)
  .listen(PORT, () => console.log(`Listening to ${PORT}`))
