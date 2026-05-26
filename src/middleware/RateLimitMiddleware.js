const rateLimit =require('express-rate-limit')

const otpLimiter =rateLimit({windowMs: 5 * 60 * 1000,max: 5,message: {status: false, error:'Too many OTP requests'}
})

module.exports = {
  otpLimiter
}