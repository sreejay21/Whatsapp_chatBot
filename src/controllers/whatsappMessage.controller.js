const messageRepository = require('../repositories/message.repository')
const { successResponse } = require('../utils/response.util')

/*** Save incoming or outgoing message */
const createMessage = async (payload) => {
  try {
    return await messageRepository.create(payload)
  } catch (error) {
    console.error('Create message error:', error)
    throw error
  }
}

/*** Get messages by phone (chat details screen)*/
const listMessagesByPhone = async (req, res) => {
  try {
    const { phone } = req.params

    const messages = await messageRepository.listByPhone(phone)

    return successResponse(res, messages)
  } catch (error) {
    console.error('List messages error:', error)
    return res.status(500).json({
      message: 'Failed to fetch messages',
      error: error.message
    })
  }
}

module.exports = {
  createMessage,
  listMessagesByPhone
}
