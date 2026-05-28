const mongoose = require('mongoose')

const conversationChatSchema =
  new mongoose.Schema({

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    chatId: {
      type: String,
      required: true
    },

    messageId: {
      type: Number,
      required: true
    },

    senderId: {
      type: String,
      default: null
    },

    message: {
      type: String,
      default: ''
    },

    messageDate: {
      type: Date
    },

    hasMedia: {
      type: Boolean,
      default: false
    },

    mediaType: {
      type: String,
      default: null
    }

  }, {
    timestamps: true
  })

conversationChatSchema.index(
  {
    userId: 1,
    chatId: 1,
    messageId: 1
  },
  {
    unique: true
  }
)

module.exports = mongoose.model(
  'conversations',
  conversationChatSchema
)