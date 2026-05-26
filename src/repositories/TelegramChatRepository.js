const telegramAuth = require('../services/telegram/telegram.service')

const fetchChats = async () => {
  try {

    const dialogs = await telegramAuth.getAllChats()

    return dialogs.map(dialog => ({
      id: dialog.id,

      title:
        dialog.title ||
        dialog.name ||
        'Unknown',

      isUser: dialog.isUser,

      isGroup: dialog.isGroup,

      isChannel: dialog.isChannel,

      unreadCount: dialog.unreadCount
    }))

  } catch (error) {
    throw error
  }
}

module.exports = {
  fetchChats
}