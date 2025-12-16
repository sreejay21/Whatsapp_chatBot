const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  phone: String,
  otp: String,
  expiresAt: Date,
  verified: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('whatsapp_otps', schema)
