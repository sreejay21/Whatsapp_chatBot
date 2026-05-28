const telegramAuth = require("../services/telegram/telegram.service");
const userRepository = require("../repositories/userRespository");
const { decrypt } = require("../crypto/crypto.util");

const fetchChats = async ({ page, limit, userId }) => {
  try {
    const user = await userRepository.findById(userId);
    if (!user?.telegramSession) {
      throw new Error(
        "User has no Telegram session. Please authenticate first.",
      );
    }

    const sessionString = decrypt(user.telegramSession);
    const dialogs = await telegramAuth.getAllChats(sessionString);
    const totalChats = dialogs.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDialogs = dialogs.slice(startIndex, endIndex);

    const chats = paginatedDialogs.map((dialog) => {
      const msg = dialog.message;

      return {
        id: dialog.id,
        name: dialog.name || dialog.title || "Unknown",

        lastMessage: msg?.message || "",
        messageId: msg?.id || null,
        lastMessageTime: msg?.date || null,

        hasMedia: !!msg?.media,
        mediaType: msg?.media?.className || null,

        avatar: dialog.avatar || null,

        isOnline: dialog.isOnline || false,
        hasUnreadMessages: dialog.hasUnreadMessages || false,

        isUser: dialog.isUser,
        isGroup: dialog.isGroup,
        isChannel: dialog.isChannel,

        unreadCount: dialog.unreadCount || 0,
      };
    });

    return {
      chats,
      pagination: {
        total: totalChats,
        page,
        limit,
        totalPages: Math.ceil(totalChats / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  fetchChats,
};
