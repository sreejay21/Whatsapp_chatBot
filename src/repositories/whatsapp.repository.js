const axios = require('axios')
const { env } = require('../config/env')

const whatsappRepository = {

async sendTemplateMessage(to, template) {
  try {
    const url = `https://graph.facebook.com/v18.0/${env.phoneNumberId}/messages`

    const response = await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template
      },
      {
        headers: {
          Authorization: `Bearer ${env.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data
  } catch (error) {
  console.error(
    'WhatsApp API Error:',
    JSON.stringify(error.response?.data, null, 2)
  )
  throw error
}
},

  async sendTextMessage (to, text) {
    try {
      const url = `https://graph.facebook.com/v22.0/${env.phoneNumberId}/messages`

      return await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: text }
        },
        {
          headers: {
            Authorization: `Bearer ${env.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )
    } catch (error) {
      throw new Error(error)
    }
  }

}

module.exports = whatsappRepository
