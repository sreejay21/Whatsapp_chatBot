const otpRepo = require('../repositories/otp.repository')
const whatsappRepo = require('../repositories/whatsapp.repository')

module.exports = {
  sendOTP: async (phone) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    await otpRepo.create({
      phone,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    })

    await whatsappRepo.sendTemplateMessage(phone, {
      name: 'hello_world ',
      language: { code: 'en_US' },
      components: [{
        type: 'body',
        parameters: [{ type: 'text', text: otp }]
      }]
    })
  },

  verifyOTP: async (phone, otp) => {
    const record = await otpRepo.findValid(phone, otp)
    if (!record) return false
    record.verified = true
    await record.save()
    return true
  }
}
