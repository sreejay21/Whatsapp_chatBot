const {
  body
} = require('express-validator')

const sendOtpValidation = [

  body('phoneNumber')

    .trim()

    .notEmpty()

    .withMessage(
      'Phone number is required'
    )

    .isMobilePhone('any')

    .withMessage(
      'Invalid phone number'
    )
]

const verifyOtpValidation = [

  body('code')

    .trim()

    .notEmpty()

    .withMessage(
      'OTP code is required'
    )

    .isLength({
      min: 4,
      max: 10
    })

    .withMessage(
      'Invalid OTP code'
    )
]

module.exports = {
  sendOtpValidation,
  verifyOtpValidation
}