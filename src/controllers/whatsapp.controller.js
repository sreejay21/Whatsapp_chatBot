const whatsappRepository = require('../repositories/whatsapp.repository')
const { env } = require('../config/env')
const { successResponse } = require('../utils/response.util')
const chatController = require('./whatsappChat.controller')


/*** Webhook verification (Meta requirement)*/
const verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === env.verifyToken) {
    return res.status(200).send(challenge)
  }

  return res.sendStatus(403)
}

/*** Receive incoming message webhook ***/
const receiveMessage = async (req, res) => {
  const message =
    req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]

  if (!message) return res.sendStatus(200)

  const from = message.from
  const text = message.text?.body || ''

  // Save message
  await messageController.createMessage({
    phone: from,
    message: text,
    direction: 'IN',
    timestamp: new Date()
  })

  // Update chat
  await chatController.upsertChat(from, text)

  // Auto reply
  await whatsappRepository.sendTextMessage(
    from,
    'Thanks for your message 🙌'
  )

  res.sendStatus(200)
}



/*** Send template message (OTP / notification) ***/
const sendMessage = async (req, res) => {
  try {
    const { to, template } = req.body

    await whatsappRepository.sendTemplateMessage(to, template)

    return successResponse(res, 'Message sent successfully')
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'Failed to send message',
      error: error.message
    })
  }
}

module.exports = {
  verifyWebhook,
  receiveMessage,
  sendMessage
}
