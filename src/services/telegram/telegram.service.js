const { Api } =require('telegram')

const {getClient} = require('./telegram.client')



const sendOtp = async (fullPhoneNumber) => {

  const client =await getClient()

  const result =await client.sendCode(
      {apiId: Number(process.env.TELEGRAM_API_ID),apiHash:process.env.TELEGRAM_API_HASH},fullPhoneNumber)

  return {phoneNumber: fullPhoneNumber,phoneCodeHash:result.phoneCodeHash}
}


const verifyOtp = async (fullPhoneNumber,phoneCodeHash,code) => {

  const client =await getClient()

  try {

    const result =await client.invoke(new Api.auth.SignIn({phoneNumber: fullPhoneNumber,phoneCodeHash,phoneCode: code}))
    return result

} catch (error) {

    if (error.errorMessage ===
      'SESSION_PASSWORD_NEEDED'
    ) {

      return {
        requiresPassword: true
      }
    }

    throw error
  }
}

const getAllChats = async () => {

  const client = await getClient()

  return await client.getDialogs({})
}


module.exports = {
  sendOtp,
  verifyOtp,
  getAllChats
}