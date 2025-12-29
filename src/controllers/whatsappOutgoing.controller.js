const whatsAppRepository = require("../repositories/whatsappOutgoing.repository");
const { encrypt } = require("../config/crypto.util");
const { sanitizeOutgoingPayload } = require("../config/whatsappPayload.util");
const responseHandler = require("../utils/response.handler");
const fs = require("fs");

const sendTextMessage = async (req, res) => {
  try {
    const { to, message } = req.body;

    const messagePayload = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message },
    };

    // Send message to WhatsApp
    const response = await whatsAppRepository.sendMessage(messagePayload);

    const outgoingMessage = {
      to: encrypt(to),
      type: "text",
      whatsappMessageId: response?.messages?.[0]?.id || null,
      status: "SENT",
      requestPayload: sanitizeOutgoingPayload(messagePayload),
      responsePayload: sanitizeOutgoingPayload(response),
    };

    await whatsAppRepository.saveOutgoingMessage(outgoingMessage);

    responseHandler.Ok(response, res);
  } catch (err) {
    responseHandler.internalServerError(res, err.message);
  }
};

const sendTemplateMessage = async (req, res) => {
  try {
    const { to, name, discount } = req.body;

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: "discount",
        language: { code: "en_US" },
        components: [
          {
            type: "header",
            parameters: [{ type: "text", text: name }],
          },
          {
            type: "body",
            parameters: [{ type: "text", text: discount }],
          },
        ],
      },
    };

    const response = await whatsAppRepository.sendMessage(payload);
    responseHandler.Ok(response, res);
  } catch (err) {
    responseHandler.internalServerError(res, err.message);
  }
};

/// Send a document to a WhatsApp user
const sendMediaMessage = async (req, res) => {
  try {
    const { to, link } = req.body;

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "document",
      document: {
        link,
      },
    };

    const response = await whatsAppRepository.sendMessage(payload);

    const outgoingMessage = {
      to: encrypt(to),
      type: "document",
      whatsappMessageId: response?.messages?.[0]?.id || null,
      status: "SENT",
      requestPayload: sanitizeOutgoingPayload(payload),
      responsePayload: sanitizeOutgoingPayload(response.data),
    };

    await whatsAppRepository.saveOutgoingMessage(outgoingMessage);

    responseHandler.Ok(response, res);
  } catch (err) {
    responseHandler.internalServerError(res, err.message);
  }
};

// Send a Image to a WhatsApp user via a link

const sendImageViaLink = async (req, res) => {
  try {
    const { to, link } = req.body;

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "image",
      image: {
        link,
      },
    };

    const response = await whatsAppRepository.sendMessage(payload);

    const outgoingMessage = {
      to: encrypt(to),
      type: "image",
      whatsappMessageId: response?.messages?.[0]?.id || null,
      status: "SENT",
      requestPayload: sanitizeOutgoingPayload(payload),
      responsePayload: sanitizeOutgoingPayload(response.data),
    };

    await whatsAppRepository.saveOutgoingMessage(outgoingMessage);

    responseHandler.Ok(response, res);
  } catch (err) {
    responseHandler.internalServerError(res, err.message);
  }
};

const uploadImageController = async (req, res) => {
  try {
    const response = await whatsAppRepository.uploadImage(
      req.file.path,
      req.file.mimetype,
    );

    await whatsAppRepository.saveOutgoingMessage({
      to: req.body.to,
      type: "image",
      whatsappMediaId: response.id,
      status: "UPLOADED",
      requestPayload: sanitizeOutgoingPayload({
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
      }),
      responsePayload: sanitizeOutgoingPayload(response),
    });

    responseHandler.Ok(response, res);
  } catch (err) {
    console.error("Upload Error:", err.response?.data || err.message);
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    responseHandler.internalServerError(res, err.response?.data || err.message);
  }
};

const sendHelloWorldTemplate = async (req, res) => {
  try {
    const { to } = req.body;

    const messagePayload = {
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: "hello_world",
        language: { code: "en_US" },
      },
    };

    // Send message to WhatsApp
    const response = await whatsAppRepository.sendMessage(messagePayload);

    const outgoingMessage = {
      to: encrypt(to),
      type: "template",
      whatsappMessageId: response?.messages?.[0]?.id || null,
      status: "SENT",
      requestPayload: sanitizeOutgoingPayload(messagePayload),
      responsePayload: sanitizeOutgoingPayload(response),
    };

    await whatsAppRepository.saveOutgoingMessage(outgoingMessage);

    responseHandler.Ok(response, res);
  } catch (err) {
    responseHandler.internalServerError(res, err.message);
  }
};

// Upload and send image to WhatsApp user
const uploadAndSendImageController = async (req, res) => {
  try {
    const { to, caption } = req.body;

    const uploadResponse = await whatsAppRepository.uploadImage(
      req.file.path,
      req.file.mimetype,
    );

    const sendResponse = await whatsAppRepository.sendImageMessage({
      to,
      mediaId: uploadResponse.id,
      caption,
    });

    await whatsAppRepository.saveOutgoingMessage({
      to,
      type: "image",
      whatsappMediaId: uploadResponse.id,
      whatsappMessageId: sendResponse.messages?.[0]?.id,
      status: "SENT",
      requestPayload: { caption },
      responsePayload: sendResponse,
    });

    responseHandler.Ok(sendResponse, res);
  } catch (err) {
    console.error(err.response?.data || err.message);
    responseHandler.internalServerError(res, err.response?.data || err.message);
  }
};

module.exports = {
  sendTextMessage,
  sendTemplateMessage,
  sendMediaMessage,
  uploadImageController,
  sendHelloWorldTemplate,
  sendImageViaLink,
  uploadAndSendImageController,
};
