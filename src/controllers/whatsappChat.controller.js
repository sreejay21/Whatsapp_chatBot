const whatsappChatRepo = require("../repositories/whatsappChat.repository");
const { decrypt, encrypt } = require("../config/crypto.util");
const responseHandler = require("../utils/response.handler");
const { ApifyClient } = require("apify-client");

const apifyClient = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});


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

    if (!phoneNumber) {
      return responseHandler.badRequest(
        "phoneNumber is required",
        res
      );
    }

    const input = {
      phoneNumber: phoneNumber,
    };


    const run = await apifyClient
      .actor("JabmO39Sb2VHt2FGb")
      .call(input);


    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();

    const result = items.length ? items[0] : null;

    return responseHandler.Ok(result, res);

  } catch (error) {
    console.error("WhatsApp validation error:", error);
    return responseHandler.internalServerError(
      res,
      error.message
    );
  }
};



module.exports = {
  getWhatsappChatHistory,
  validateWhatsappNumber,
};
