const express = require('express')
const whatsappRoutes = require('./src/routes/whatsapp.routes')

const app = express()

app.use(express.json())
app.use('/api/whatsapp', whatsappRoutes)

module.exports = app
