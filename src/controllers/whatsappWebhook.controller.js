const whatsAppRepo = require('../repositories/whatsappWebhook.repository')

// Webhook verification
const verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode']
  const challenge = req.query['hub.challenge']
  const token = req.query['hub.verify_token']

  if (mode && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge)
  } else {
    res.sendStatus(403)
  }
}

// Webhook handler
const handleWebhook = async (req, res) => {
  try {
    const { entry } = req.body
    if (!entry || entry.length === 0) return res.status(400).send('Invalid Request')

    const changes = entry[0].changes
    if (!changes || changes.length === 0) return res.status(400).send('Invalid Request')

    const value = changes[0].value
    const statuses = value.statuses?.[0]
    const messages = value.messages?.[0]

    // ===== Handle Status Updates =====
    if (statuses) {
      const allowedStatuses = ['sent', 'delivered', 'read', 'failed']
      const messageStatus = allowedStatuses.includes(statuses.status) ? statuses.status : 'unknown'

      await whatsAppRepo.saveIncomingMessage({
        from: statuses.recipient_id,
        type: 'status',
        messageId: statuses.id,
        status: messageStatus,
        statusData: statuses,
        rawPayload: value
      })

      console.log(`Message ${statuses.id} updated to status: ${messageStatus}`)
    }

    // ===== Handle Incoming Messages =====
    if (messages) {
      // Save incoming message
      await whatsAppRepo.saveIncomingMessage({
        from: messages.from,
        type: messages.type,
        messageId: messages.id,
        textBody: messages.type === 'text' ? messages.text.body : undefined,
        interactiveData: messages.type === 'interactive' ? messages.interactive : undefined,
        rawPayload: value
      })

      // Dynamic text message handler
      if (messages.type === 'text') {
        await handleTextMessage(messages)
      }

      // Interactive message handler
      if (messages.type === 'interactive') {
        await handleInteractiveMessage(messages)
      }
    }

    res.status(200).send('Webhook processed')
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message)
  }
}

// ===== Dynamic Text Message Handler =====
const handleTextMessage = async (messages) => {
  const userMessage = messages.text.body.trim()
  const from = messages.from
  const messageId = messages.id

  // Default: echo back
  let reply = `You said: "${userMessage}"`

  // Simple keyword-based dynamic replies
  const msgLower = userMessage.toLowerCase()
  if (msgLower.includes('hello')) reply = 'Hello! How are you?'
  else if (msgLower.includes('list')) return await sendList(from)
  else if (msgLower.includes('buttons')) return await sendReplyButtons(from)

  await replyMessage(from, reply, messageId)
}

// ===== Interactive Message Handler =====
const handleInteractiveMessage = async (messages) => {
  const from = messages.from
  const interactive = messages.interactive

  if (interactive.type === 'list_reply') {
    await sendMessage(
      from,
      `You selected the option with ID ${interactive.list_reply.id} - Title ${interactive.list_reply.title}`
    )
  }

  if (interactive.type === 'button_reply') {
    await sendMessage(
      from,
      `You selected the button with ID ${interactive.button_reply.id} - Title ${interactive.button_reply.title}`
    )
  }
}

// ===== Helper functions using repo =====
const sendMessage = async (to, body) => {
  const payload = { messaging_product: 'whatsapp', to, type: 'text', text: { body } }
  return await whatsAppRepo.sendMessage(payload)
}

const replyMessage = async (to, body, messageId) => {
  const payload = { messaging_product: 'whatsapp', to, type: 'text', text: { body }, context: { message_id: messageId } }
  return await whatsAppRepo.sendMessage(payload)
}

const sendList = async (to) => {
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'interactive',
    interactive: {
      type: 'list',
      header: { type: 'text', text: 'Message Header' },
      body: { text: 'This is a interactive list message' },
      footer: { text: 'This is the message footer' },
      action: {
        button: 'Tap for the options',
        sections: [
          {
            title: 'First Section',
            rows: [
              { id: 'first_option', title: 'First option', description: 'This is the description of the first option' },
              { id: 'second_option', title: 'Second option', description: 'This is the description of the second option' }
            ]
          },
          { title: 'Second Section', rows: [{ id: 'third_option', title: 'Third option' }] }
        ]
      }
    }
  }
  return await whatsAppRepo.sendMessage(payload)
}

const sendReplyButtons = async (to) => {
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      header: { type: 'text', text: 'Message Header' },
      body: { text: 'This is a interactive reply buttons message' },
      footer: { text: 'This is the message footer' },
      action: {
        buttons: [
          { type: 'reply', reply: { id: 'first_button', title: 'First Button' } },
          { type: 'reply', reply: { id: 'second_button', title: 'Second Button' } }
        ]
      }
    }
  }
  return await whatsAppRepo.sendMessage(payload)
}

module.exports = { verifyWebhook, handleWebhook }
