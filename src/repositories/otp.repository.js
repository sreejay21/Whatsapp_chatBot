const whatsappOtpDetails = require('../models/whatsappOtp.model')

const otpRepository = {

  async create (payload) {
    try {
      return await whatsappOtpDetails.create(payload)
    } catch (error) {
      throw new Error(error)
    }
  },

  async findValid (phone, otp) {
    try {
      return await whatsappOtpDetails.findOne({
        phone,
        otp,
        verified: false,
        expiresAt: { $gt: new Date() }
      }).exec()
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = otpRepository
