const WhatsappIncomingMessage = require("../models/whatsappWebhookMessage.model");
const WhatsappOutgoingMessage = require("../models/whatsappOutgoingMessage.model");

const getUserChatHistory = async ({ encryptedPhone, page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const incomingQuery = WhatsappIncomingMessage.find({
    from: encryptedPhone,
  })
    .select("type textBody rawPayload createdAt messageId status")
    .lean();

  const outgoingQuery = WhatsappOutgoingMessage.find({
    to: encryptedPhone,
  })
    .select("type requestPayload createdAt whatsappMessageId status")
    .lean();

  const [incoming, outgoing] = await Promise.all([
    incomingQuery,
    outgoingQuery,
  ]);

  const normalizedIncoming = incoming.map((msg) => ({
    direction: "incoming",
    messageId: msg.messageId,
    type: msg.type,
    text: msg.textBody || msg.rawPayload?.messages?.[0]?.text?.body || null,
    status: msg.status,
    createdAt: msg.createdAt,
  }));

  const normalizedOutgoing = outgoing.map((msg) => ({
    direction: "outgoing",
    messageId: msg.whatsappMessageId,
    type: msg.type,
    text:
      msg.requestPayload?.text?.body ||
      msg.requestPayload?.template?.name ||
      null,
    status: msg.status,
    createdAt: msg.createdAt,
  }));

  const combined = [...normalizedIncoming, ...normalizedOutgoing].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  );

  return {
    chats: combined.slice(skip, skip + limit),
    pagination: {
      page,
      limit,
      total: combined.length,
      totalPages: Math.ceil(combined.length / limit),
    },
  };
};

module.exports = {
  getUserChatHistory,
};
