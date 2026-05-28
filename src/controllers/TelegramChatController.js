const telegramRepository = require('../repositories/TelegramChatRepository')
const response = require('../helpers/response.helper')

const getChats = async (req, res) => {

  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 20
    const userId = req.user.userId
    const chats = await telegramRepository.fetchChats({
      userId,
      page,
      limit
    })

    return response.Ok(
      chats ,
      res
    )

  } catch (err) {

    return response.internalServerError(
      res,
      err.message
    )
  }
}

module.exports = {
  getChats
}