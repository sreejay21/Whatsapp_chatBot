import dotenv from 'dotenv'

dotenv.config()

const requiredEnv = [
  'WHATSAPP_TOKEN',
  'WHATSAPP_PHONE_NUMBER_ID',
  'WHATSAPP_API_VERSION',
  'WHATSAPP_BASE_URL',
  'MONGO_URI'
]

if (process.env.NODE_ENV === 'development') {
  requiredEnv.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required env variable: ${key}`)
    }
  })
}

const env = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI,

  whatsapp: {
    token: process.env.WHATSAPP_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    apiVersion: process.env.WHATSAPP_API_VERSION,
    baseUrl: process.env.WHATSAPP_BASE_URL
  }
}

export default env
