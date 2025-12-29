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
  return response.data;
};

const saveOutgoingMessage = async (payload) => {
  return await WhatsappOutgoingMessage.create({
    to: payload.to, // encrypted already
    type: payload.type,
    requestPayload: payload.requestPayload,
    responsePayload: payload.responsePayload,
    whatsappMessageId: payload.whatsappMessageId,
    status: payload.status,
  });
};

// Upload image to WhatsApp
const uploadImage = async (filePath, mimeType) => {
  if (!fs.existsSync(filePath)) {
    throw new Error("File does not exist");
  }

  const data = new FormData();
  data.append("messaging_product", "whatsapp");

  data.append("file", fs.createReadStream(filePath), {
    contentType: mimeType,
  });

  try {
    const response = await axios.post(`${BASE_URL}/media`, data, {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        ...data.getHeaders(),
      },
    });

    return response.data;
  } catch (err) {
    console.error("WhatsApp Media Upload Error:", err.response?.data);
    throw err;
  }
};

const sendImageMessage = async ({ to, mediaId, caption }) => {
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "image",
    image: {
      id: mediaId,
      ...(caption && { caption }),
    },
  };

  const response = await axios.post(`${BASE_URL}/messages`, payload, {
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

module.exports = {
  createMessagePayload,
  sendMessage,
  uploadImage,
  saveOutgoingMessage,
  sendImageMessage,
};
