const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const WhatsappOutgoingMessage = require("../models/whatsappOutgoingMessage.model");
require("dotenv").config();

const BASE_URL = `${process.env.WHATSAPP_BASE_URL}/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}`;

const createMessagePayload = (to, type, content) => ({
  to,
  type,
  [type]: content,
});

const sendMessage = async (payload) => {
  const response = await axios.post(`${BASE_URL}/messages`, payload, {
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  const messageData = {
    to: payload.to,
    type: payload.type,
    requestPayload: payload,
    responsePayload: response.data,
    whatsappMessageId: response.data.messages?.[0]?.id,
  };

  return await WhatsappOutgoingMessage.create(messageData);
};

const uploadImage = async (filePath) => {
  const data = new FormData();
  data.append("messaging_product", "whatsapp");
  data.append("file", fs.createReadStream(filePath));
  data.append("type", "image/png");

  const response = await axios.post(`${BASE_URL}/media`, data, {
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      ...data.getHeaders(),
    },
  });

  return response.data;
};

module.exports = { createMessagePayload, sendMessage, uploadImage };
