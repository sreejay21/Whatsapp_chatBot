const express = require('express')
const bodyParser = require('body-parser')

const whatsappRoutes = require('./routes/whatsapp.routes')
const otpRoutes = require('./routes/otp.routes')
const messageRoutes = require('./routes/whatsappMessage.routes')
const { swaggerUi, swaggerSpec } = require('./config/swagger')

const app = express()

// Middleware
app.use(bodyParser.json())

// Routes
app.use('/api/whatsapp', whatsappRoutes)
app.use('/api/otp', otpRoutes)
app.use('/api/whatsapp', messageRoutes)

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

module.exports = app
