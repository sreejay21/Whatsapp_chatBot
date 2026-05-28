const telegramRepository = require("../repositories/TelegramChatRepository");
const response = require("../helpers/response.helper");
const userRepository = require("../repositories/userRespository");
const telegramAuth = require("../services/telegram/telegram.service");
const telegramChatRepository = require("../repositories/conversationChatRepository");

const getChats = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 20;
    const userId = req.user.userId;
    const chats = await telegramRepository.fetchChats({
      userId,
      page,
      limit,
    });

    return response.Ok(chats, res);
  } catch (err) {
    return response.internalServerError(res, err.message);
  }
};

const syncSelectedChats = async (req, res) => {
  try {
    const { chatIds } = req.body;

    if (!Array.isArray(chatIds) || !chatIds.length) {
      return response.badRequest(res, "chatIds is required");
    }

    const user = await userRepository.findById(req.user.id);

    if (!user) {
      return response.notFound(res, "User not found");
    }

    const client = await telegramAuth.getAuthenticatedClient(
      user.telegramSession,
    );

    for (const chatId of chatIds) {
      const messages = await telegramAuth.getMessages({
        client,
        chatId,
        limit: 100,
      });

      const formattedMessages = messages.map((msg) => ({
        userId: user._id,
        chatId,
        messageId: msg.id,
        senderId: msg.senderId?.toString() || null,
        message: msg.message || "",
        messageDate: msg.date,
        hasMedia: !!msg.media,
        mediaType: msg.media?.className || null,
      }));

      await telegramChatRepository.saveMessages(formattedMessages);
    }

    return response.Ok(
      {
        message: "Selected chats synced successfully",
      },
      res,
    );
  } catch (err) {
    return response.internalServerError(res, err.message);
  }
};

module.exports = {
  getChats,
  syncSelectedChats,
};
