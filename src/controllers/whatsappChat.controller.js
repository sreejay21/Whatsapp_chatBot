const whatsappChatRepo = require("../repositories/whatsappChat.repository");
const { decrypt, encrypt } = require("../config/crypto.util");
const responseHandler = require("../utils/response.handler");

const getWhatsappChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page, limit } = req.query;
    const plainPhone = decrypt(userId);
    const encryptedPhone = encrypt(plainPhone);

    const result = await whatsappChatRepo.getUserChatHistory({
      encryptedPhone,
      plainPhone,
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    });

    return responseHandler.Ok(
      {
        chats: result.chats,
        pagination: result.pagination,
      },
      res,
    );
  } catch (err) {
    console.error("Chat history error:", err);
    return responseHandler.internalServerError(
      res,
      "Failed to fetch chat history",
    );
  }
};

module.exports = {
  getWhatsappChatHistory,
};
