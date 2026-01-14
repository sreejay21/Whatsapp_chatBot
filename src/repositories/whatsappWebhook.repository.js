const axios = require("axios");
const WhatsappIncomingMessage = require("../models/whatsappWebhookMessage.model");
require("dotenv").config();

const BASE_URL = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}`;

// ===== Send WhatsApp Message =====
const sendMessage = async (payload) => {
  const response = await axios.post(`${BASE_URL}/messages`, payload, {
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// ===== Save Incoming Message (only once) =====
const saveIncomingMessage = async (messagePayload) => {
  const exists = await WhatsappIncomingMessage.findOne({
    messageId: messagePayload.messageId,
  });
  if (exists) return exists;
  return await WhatsappIncomingMessage.create({
    from: messagePayload.from,
    type: messagePayload.type,
    messageId: messagePayload.messageId,

    textBody: messagePayload.textBody,
    interactiveData: messagePayload.interactiveData,

    mediaUrl: messagePayload.mediaUrl,
    mediaMeta: messagePayload.mediaMeta,

    rawPayload: messagePayload.rawPayload,
    fileName: messagePayload.fileName,
    size: messagePayload.size,

    status: "delivered",
    statusHistory: [{ status: "delivered", timestamp: new Date() }],
  });
};
// ===== Update Message Status =====
const updateMessageStatus = async (messageId, status, statusData) => {
  const message = await WhatsappIncomingMessage.findOne({ messageId });
  if (!message) return null;

  message.status = status;
  message.statusData = statusData;
  message.statusHistory.push({ status, timestamp: new Date() });

  return await message.save();
};

module.exports = {
  sendMessage,
  saveIncomingMessage,
  updateMessageStatus,
};
