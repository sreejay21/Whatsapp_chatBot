require('dotenv').config()
const express = require('express')
const path = require('path')
const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session')
const connectDb = require('./src/config/mongoDBConnection')
const corsMiddleware = require('./src/cors/cors')
const routes = require('./src/routes/index')



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


// Health Route
app.get('/', (req, res) => {

  return res.status(200).json({
    message: 'Welcome To Ritro'
  })
})

module.exports = app