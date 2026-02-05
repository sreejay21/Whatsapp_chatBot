const whatsappChatRepo = require("../repositories/whatsappChat.repository");
const { decrypt, encrypt } = require("../config/crypto.util");
const responseHandler = require("../utils/response.handler");
const { ApifyClient } = require("apify-client");
const whatsappUserRepo = require("../repositories/whatsappUser.repository");
const incomingRepo = require("../repositories/whatsappWebhook.repository");
const groupRepo = require("../repositories/whatsappGroup.repository");
const outgoingRepo = require("../repositories/whatsappOutgoing.repository");

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


const getWhatsappChatWindowStatus = async (req, res) => {
  try {
    const { encryptedPhone, groupId } = req.query;

    const isWithin24Hours = (date) => {
      if (!date) return false;
      return (
        Date.now() - new Date(date).getTime() <=
        24 * 60 * 60 * 1000
      );
    };

    // ❗ Validation
    if (!encryptedPhone && !groupId) {
      return responseHandler.badRequest(
        "encryptedPhone or groupId is required",
        res
      );
    }

    /**
     * =========================
     * DIRECT CHAT
     * =========================
     */
    if (encryptedPhone && !groupId) {
      const waUser =
        await whatsappUserRepo.findByEncryptedPhone(encryptedPhone);

      if (!waUser) {
        return responseHandler.notFound(
          res,
          "WhatsApp user not found"
        );
      }

      const lastIncoming =
        await incomingRepo.findLastIncomingByPhone(
          waUser.encryptedPhone
        );

      const lastTemplate =
        await outgoingRepo.findLastTemplateByPhone(
          waUser.encryptedPhone
        );

      let window = "CLOSED";
      let openedAt = null;

      // User reply (highest priority)
      if (lastIncoming && isWithin24Hours(lastIncoming.createdAt)) {
        window = "OPEN";
        openedAt = lastIncoming.createdAt;
      }
      // Template override
      else if (
        lastTemplate &&
        isWithin24Hours(lastTemplate.createdAt)
      ) {
        window = "OPEN";
        openedAt = lastTemplate.createdAt;
      }

      return responseHandler.Ok(
        {
          encryptedPhone,
          window,
          openedAt,
          lastUserMessageAt: lastIncoming?.createdAt || null
        },
        res
      );
    }

    /**
     * =========================
     * GROUP CHAT
     * =========================
     */
    if (groupId) {
      const decryptedGroupId = decrypt(groupId);

      const group = await groupRepo.findById(decryptedGroupId);

      if (!group) {
        return responseHandler.notFound(
          res,
          "Group not found"
        );
      }

      // Only WhatsApp members
      const memberUserIds = group.members
        .filter((m) => m.source === "WHATSAPP")
        .map((m) => m.userId);

      const waUsers =
        await whatsappUserRepo.findByUserIds(memberUserIds);

      const result = [];

      for (const user of waUsers) {
        const lastIncoming =
          await incomingRepo.findLastIncomingByPhone(
            user.encryptedPhone
          );

        const lastTemplate =
          await outgoingRepo.findLastTemplateByPhone(
            user.encryptedPhone
          );

        let window = "CLOSED";
        let openedAt = null;

        if (lastIncoming && isWithin24Hours(lastIncoming.createdAt)) {
          window = "OPEN";
          openedAt = lastIncoming.createdAt;
        } else if (
          lastTemplate &&
          isWithin24Hours(lastTemplate.createdAt)
        ) {
          window = "OPEN";
          openedAt = lastTemplate.createdAt;
        }

        result.push({
          userId: user.userId,
          name: user.name,
          encryptedPhone: user.encryptedPhone,
          window,
          openedAt,
          lastUserMessageAt: lastIncoming?.createdAt || null
        });
      }

      return responseHandler.Ok(
        {
          groupId,
          members: result
        },
        res
      );
    }
  } catch (err) {
    console.error(err);
    return responseHandler.internalServerError(
      res,
      "Internal server error"
    );
  }
};


module.exports = {
  getWhatsappChatHistory,
  validateWhatsappNumber,
  getWhatsappChatWindowStatus,
};
