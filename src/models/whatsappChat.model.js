const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  phone: String,
  lastMessage: String,
  lastMessageAt: Date,
  unreadCount: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('whatsapp_chats', schema)
