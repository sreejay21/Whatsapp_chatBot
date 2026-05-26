const telegramAuth = require('../services/telegram/telegram.service')
const response = require('../helpers/response.helper')


// OTP sending handler
const sendOtp = async (req,res) => {
try {

    const { countryCode, phoneNumber } = req.body
    const fullPhoneNumber = `${countryCode}${phoneNumber}`

    const result =await telegramAuth.sendOtp(fullPhoneNumber)

    req.session.telegramAuth =result

    return response.Ok({message:'OTP sent successfully'},res)

  } 
  catch (err) {
  return response.internalServerError(res,err.message)
  }
}


// OTP verification handler
const verifyOtp = async (req,res) => {
try {

    const { code } =req.body

    const authData =req.session.telegramAuth

    if (!authData) {
     return response.badRequest(res,'OTP session expired')
    }

    const result =await telegramAuth.verifyOtp(authData.phoneNumber,authData.phoneCodeHash,code)

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