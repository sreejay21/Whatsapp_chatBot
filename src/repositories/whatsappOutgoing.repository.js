const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const WhatsappOutgoingMessage = require("../models/whatsappOutgoingMessage.model");
require("dotenv").config();
const path = require("path");

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
    mediaUrl: payload.mediaUrl,
    type: payload.type,
    requestPayload: payload.requestPayload,
    responsePayload: payload.responsePayload,
    whatsappMessageId: payload.whatsappMessageId,
    status: payload.status,
    fileName: payload.fileName,
    size: payload.size,
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

// Upload document to WhatsApp
const sendDocumentMessage = async ({ to, mediaId, caption, filename }) => {
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "document",
    document: {
      id: mediaId,
      caption,
      filename,
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

// Upload document to WhatsApp

const uploadDocument = async (filePath, mimeType) => {
  if (!fs.existsSync(filePath)) {
    throw new Error("File does not exist");
  }

  const formData = new FormData();

  formData.append("file", fs.createReadStream(filePath), {
    contentType: mimeType,
    filename: path.basename(filePath),
  });

  formData.append("messaging_product", "whatsapp");

  const response = await axios.post(`${BASE_URL}/media`, formData, {
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      ...formData.getHeaders(),
    },
  });

  return response.data;
};

const findLastTemplateByPhone = async (encryptedPhone) => {
  return await WhatsappOutgoingMessage.findOne({ to: encryptedPhone, type: "template" })
    .sort({ createdAt: -1 })
    .lean();
}

module.exports = {
  createMessagePayload,
  sendMessage,
  uploadImage,
  saveOutgoingMessage,
  sendImageMessage,
  sendDocumentMessage,
  uploadDocument,
  findLastTemplateByPhone
};
