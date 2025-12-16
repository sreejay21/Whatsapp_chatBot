const whatsappChatDetails = require('../models/whatsappChat.model')

const chatRepository = {

  async upsert (phone, message) {
    try {
      return await whatsappChatDetails.findOneAndUpdate(
        { phone },
        {
          phone,
          lastMessage: message,
          lastMessageAt: new Date()
        },
        { upsert: true, new: true }
      ).exec()
    } catch (error) {
      throw new Error(error)
    }
  },

  async findAll () {
    try {
      return await whatsappChatDetails
        .find({})
        .sort({ lastMessageAt: -1 })
        .exec()
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = chatRepository
