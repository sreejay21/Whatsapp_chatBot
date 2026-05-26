require('dotenv').config()

const express = require('express')
const path = require('path')
const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session')

const connectDb = require('./src/config/mongoDBConnection')

// Custom CORS middleware (optional)
const corsMiddleware = require('./src/cors/cors')

// Routes
const routes = require('./src/routes/index')

const whatsappRoutes =
  require('./src/routes/whatsapp.routes')

const whatsappWebhookRoutes =
  require('./src/routes/whatsappWebhook.route')

const whatsappUserRoutes =
  require('./src/routes/whatsappUser.routes')

const whatsappChatRoutes =
  require('./src/routes/whatsAppChat.routes')

const whatsappGroupRoutes =
  require('./src/routes/whatsappGroup.routes')

const app = express()

// Database Connection
connectDb()


// Security Middleware
app.use(helmet())

// CORS
app.use(cors())
app.use(corsMiddleware)

// Body Parsers
app.use(express.json())

app.use(express.urlencoded({
  extended: true
}))

// Session
app.use(session({
  secret:
    process.env.SESSION_SECRET ||
    'telegram-secret',

  resave: false,

  saveUninitialized: true,

  cookie: {
    secure: false
  }
}))

// Static Files
app.use(
  '/uploads',
  express.static(path.resolve('uploads'))
)

// Main API Routes
app.use('/api', routes)

// WhatsApp Routes
app.use('/api/whatsapp', whatsappRoutes)

app.use('/webhook', whatsappWebhookRoutes)

app.use(
  '/api/whatsapp-users',
  whatsappUserRoutes
)

app.use(
  '/api/whatsapp-chats',
  whatsappChatRoutes
)

app.use(
  '/api/whatsapp-groups',
  whatsappGroupRoutes
)

// Health Route
app.get('/', (req, res) => {

  return res.status(200).json({
    message: 'Welcome'
  })
})

module.exports = app