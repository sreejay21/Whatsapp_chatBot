const otpService = require('../services/otp.service')

const send = async (req, res) => {
  try {
    const { phone } = req.body

    await otpService.sendOTP(phone)

    return res.status(200).json({
      message: 'OTP sent'
    })
  } catch (error) {
    console.error('Error sending OTP:', error)

    return res.status(500).json({
      message: 'Failed to send OTP'
    })
  }
}

const verify = async (req, res) => {
  try {
    const { phone, otp } = req.body

    const isValid = await otpService.verifyOTP(phone, otp)

    if (!isValid) {
      return res.status(400).json({
        message: 'Invalid OTP'
      })
    }

    return res.status(200).json({
      message: 'Verified'
    })
  } catch (error) {
    console.error('Error verifying OTP:', error)

    return res.status(500).json({
      message: 'OTP verification failed'
    })
  }
}

module.exports = {
  send,
  verify
}
