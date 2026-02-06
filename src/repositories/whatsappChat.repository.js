const WhatsappIncomingMessage = require("../models/whatsappWebhookMessage.model");
const WhatsappOutgoingMessage = require("../models/whatsappOutgoingMessage.model");
const {renderTemplateMessage} = require("../utils/templateRenderer.js");

const getUserChatHistory = async ({ encryptedPhone, page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const incomingQuery = WhatsappIncomingMessage.find({
    from: encryptedPhone,
  })
    .select(
      "type textBody rawPayload createdAt messageId status mediaUrl fileName size",
    )
    .lean();

  const outgoingQuery = WhatsappOutgoingMessage.find({
    to: encryptedPhone,
  })
    .select(
      "type requestPayload createdAt whatsappMessageId status mediaUrl fileName size",
    )
    .lean();

  const [incoming, outgoing] = await Promise.all([
    incomingQuery,
    outgoingQuery,
  ]);

  const normalizedIncoming = incoming.map((msg) => ({
    direction: "incoming",
    messageId: msg.messageId,
    type: msg.type,
    text: msg.textBody || msg.rawPayload?.messages?.[0]?.text?.body || msg?.rawPayload?.messages?.[0]?.document?.caption || msg?.rawPayload?.messages?.[0]?.image?.caption || null,
    status: msg.status,
    createdAt: msg.createdAt,
    mediaUrl: msg.mediaUrl || null,
    fileName: msg.fileName || null,
    size: msg.size || null,
  }));

  const normalizedOutgoing = outgoing.map((msg) => {
  let text = null;

  // TEXT MESSAGE
  if (msg.type === "text") {
    text = msg.requestPayload?.text?.body || null;
  }

  // TEMPLATE MESSAGE (FULL RENDER)
  else if (msg.type === "template") {
    text =
      renderTemplateMessage(msg.requestPayload?.template) ||
      msg.requestPayload?.template?.name ||
      null;
  }

  // IMAGE CAPTION
  else if (msg.type === "image") {
    text = msg.requestPayload?.image?.caption || null;
  }

  // DOCUMENT CAPTION
  else if (msg.type === "document") {
    text = msg.requestPayload?.document?.caption || null;
  }

  return {
    direction: "outgoing",
    messageId: msg.whatsappMessageId,
    type: msg.type,
    text,
    templateName: msg.requestPayload?.template?.name || null,
    status: msg.status,
    createdAt: msg.createdAt,
    mediaUrl: msg.mediaUrl || null,
    fileName: msg.fileName || null,
    size: msg.size || null,
  };
});

  const combined = [...normalizedIncoming, ...normalizedOutgoing].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
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
