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

const validateWhatsappNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const params = new URLSearchParams();
    params.append("phone_number", phoneNumber);

    const response = await fetch(
      "https://whatsapp-number-validator3.p.rapidapi.com/WhatsappNumberHasItWithToken",
      {
        method: "POST",
        headers: {
          "x-rapidapi-key": process.env.RAPID_API_KEY,
          "x-rapidapi-host": "whatsapp-number-validator3.p.rapidapi.com",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const data = await response.json();
    responseHandler.Ok(data, res);

  } catch (error) {
    return responseHandler.internalServerError(res, error.message);
  }
};



module.exports = {
  getWhatsappChatHistory,
  validateWhatsappNumber,
};
