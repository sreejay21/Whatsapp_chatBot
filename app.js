const express = require('express')
const whatsappRoutes = require('./routes/whatsapp.routes')

const app = express()

app.use(express.json())
app.use('/api/whatsapp', whatsappRoutes)

module.exports = app
