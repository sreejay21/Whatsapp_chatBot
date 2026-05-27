const telegramAuth = require('../services/telegram/telegram.service')

const fetchChats = async () => {
  try {

    const dialogs = await telegramAuth.getAllChats()

    return dialogs.map(dialog => ({
      id: dialog.id,
      name: dialog.name,
      message: dialog.message,
      time: dialog.timestamp,
      avatar: dialog.avatar,
      isOnline: dialog.isOnline,
      hasUnreadMessages: dialog.hasUnreadMessages,
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