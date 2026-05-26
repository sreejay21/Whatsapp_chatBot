const telegramRepository = require('../repositories/TelegramChatRepository')
const response = require('../helpers/response.helper')

const getChats = async (req, res) => {

  try {

    const chats =
      await telegramRepository.fetchChats()

    return response.Ok(
      { chats },
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