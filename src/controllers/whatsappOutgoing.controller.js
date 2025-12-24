const whatsAppRepository = require('../repositories/whatsappOutgoing.repository');
const { encrypt } = require("../config/crypto.util");
const { sanitizeOutgoingPayload } = require("../config/whatsappPayload.util");

const sendTextMessage = async (req, res) => {
  try {
    const { to, message } = req.body

    const messagePayload = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message }
    }

    // Send message to WhatsApp
    const response = await whatsAppRepository.sendMessage(messagePayload)

    const outgoingMessage = {
      to: encrypt(to),
      type: 'text',
      whatsappMessageId: response?.messages?.[0]?.id || null,
      status: 'SENT',
      requestPayload: sanitizeOutgoingPayload(messagePayload),
      responsePayload: sanitizeOutgoingPayload(response)
    }

    await whatsAppRepository.saveOutgoingMessage(outgoingMessage)

    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


const sendTemplateMessage = async (req, res) => {
  try {
    const { to, name, discount } = req.body

    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: 'discount',
        language: { code: 'en_US' },
        components: [
          {
            type: 'header',
            parameters: [{ type: 'text', text: name }]
          },
          {
            type: 'body',
            parameters: [{ type: 'text', text: discount }]
          }
        ]
      }
    }

    const response = await whatsAppRepository.sendMessage(payload)
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const sendMediaMessage = async (req, res) => {
  try {
    const { to, mediaId, caption } = req.body

    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'image',
      image: {
        id: mediaId,
        caption
      }
    }

    const response = await whatsAppRepository.sendMessage(payload)
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const uploadImageController = async (req, res) => {
  try {
    const response = await whatsAppRepository.uploadImage(`${process.cwd()}/logo.png`)
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


const sendHelloWorldTemplate = async (req, res) => {
  try {
    const { to } = req.body

    const messagePayload = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: 'hello_world',
        language: { code: 'en_US' }
      }
    }

    // Send message to WhatsApp
    const response = await whatsAppRepository.sendMessage(messagePayload)

    const outgoingMessage = {
      to: encrypt(to),
      type: 'template',
      whatsappMessageId: response?.messages?.[0]?.id || null,
      status: 'SENT',
      requestPayload: sanitizeOutgoingPayload(messagePayload),
      responsePayload: sanitizeOutgoingPayload(response)
    }

    await whatsAppRepository.saveOutgoingMessage(outgoingMessage)

    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
module.exports = {
  sendTextMessage,
  sendTemplateMessage,
  sendMediaMessage,
  uploadImageController,
  sendHelloWorldTemplate
}
