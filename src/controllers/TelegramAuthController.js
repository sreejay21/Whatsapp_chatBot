const telegramAuth = require('../services/telegram/telegram.service')
const response = require('../helpers/response.helper')
const  {encrypt, decrypt}  = require('../crypto/crypto.util')


// OTP sending handler
const sendOtp = async (req,res) => {
try {

    const { countryCode, phoneNumber } = req.body
    const fullPhoneNumber = `${countryCode}${phoneNumber}`

    const result =await telegramAuth.sendOtp(fullPhoneNumber)

    return response.Ok({
      message: 'OTP sent successfully',
      data: {
        phoneNumber: encrypt(result.phoneNumber),
        phoneCodeHash: encrypt(result.phoneCodeHash)
      }
    }, res)
  } 
  catch (err) {
  return response.internalServerError(res,err.message)
  }
}


// OTP verification handler
const verifyOtp = async (req,res) => {
try {

    const { code,
      phoneNumber,
      phoneCodeHash

     } =req.body

    const decryptedPhoneNumber = decrypt(phoneNumber)
    const decryptedPhoneCodeHash = decrypt(phoneCodeHash)

    const result =await telegramAuth.verifyOtp(decryptedPhoneNumber,decryptedPhoneCodeHash,code)

    return response.Ok({message:'OTP verified successfully'},res)
  } 
  catch (err) {
   return response.internalServerError(res,err.message)
  }
}
module.exports = {
  sendOtp,
  verifyOtp
}