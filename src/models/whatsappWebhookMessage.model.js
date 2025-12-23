const mongoose = require('mongoose')

const whatsappWebhookMessageSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'audio', 'document', 'interactive', 'status'],
      required: true
    },
    messageId: { type: String },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read', 'failed', 'unknown'],
      default: 'unknown'
    },
    textBody: { type: String },
    interactiveData: { type: Object },
    statusData: { type: Object },
    rawPayload: { type: Object, required: true }
  },
  { timestamps: true }
)

const WhatsappWebhookMessage = mongoose.model('WhatsappWebhookMessage', whatsappWebhookMessageSchema)

module.exports = WhatsappWebhookMessage
