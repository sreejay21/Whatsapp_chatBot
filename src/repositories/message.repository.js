const whatsappMessageDetails = require('../models/whatsappMessage.model')

const messageRepository = {

  async create (payload) {
    try {
      return await whatsappMessageDetails.create(payload)
    } catch (error) {
      throw new Error(error)
    }
  },

  async listByPhone (phone) {
    try {
      return await whatsappMessageDetails
        .find({ phone })
        .sort({ timestamp: 1 })
        .exec()
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = messageRepository
