const axios = require('axios')
const WhatsappWebhookMessage = require('../models/whatsappWebhookMessage.model')
require('dotenv').config()

const BASE_URL = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}`

const sendMessage = async (payload) => {
  const response = await axios.post(`${BASE_URL}/messages`, payload, {
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

const saveIncomingMessage = async (messagePayload) => {
  return await WhatsappWebhookMessage.create(messagePayload)
}

module.exports = {
  sendMessage,
  saveIncomingMessage
}
