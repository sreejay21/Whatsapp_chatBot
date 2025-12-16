const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  phone: String,
  direction: String,
  message: String,
  messageId: String,
  timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('whatsapp_messages', schema)
