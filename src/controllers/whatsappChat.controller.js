const chatRepository = require('../repositories/chat.repository')
const { successResponse } = require('../utils/response.util')

/*** Save / update chat when message arrives */
const upsertChat = async (phone, message) => {
  try {
    return await chatRepository.upsert(phone, message)
  } catch (error) {
    console.error('Upsert chat error:', error)
    throw error
  }
}

/*** Get chat list*/
const listChats = async (req, res) => {
  try {
    const chats = await chatRepository.findAll()
    return successResponse(res, chats)
  } catch (error) {
    console.error('List chats error:', error)
    return res.status(500).json({
      message: 'Failed to fetch chat list',
      error: error.message
    })
  }
}

module.exports = {
  upsertChat,
  listChats
}
