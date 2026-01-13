const whatsAppRepository = require("../repositories/whatsappOutgoing.repository");
const { encrypt, decrypt } = require("../config/crypto.util");
const { sanitizeOutgoingPayload } = require("../config/whatsappPayload.util");
const responseHandler = require("../utils/response.handler");
const fs = require("fs");

// --- Helper: encrypt WhatsApp response for client
const encryptWhatsappResponseForClient = (response, encryptedTo) => {
  if (!response?.contacts?.length) return response;

  return {
    ...response,
    contacts: response.contacts.map(() => ({
      input: encryptedTo,
      wa_id: encryptedTo,
    })),
  };
};

// --- Helper: consistent error handling
const handleError = (res, err) => {
  console.error(err.response?.data || err.message);
  responseHandler.internalServerError(res, err.response?.data || err.message);
};

// --- Text message
const sendTextMessage = async (req, res) => {
  try {
    const { to: encryptedTo, message } = req.body;

    if (!encryptedTo || !message) {
      return responseHandler.badRequest(
        "Recipient and message are required",
        res,
      );
    }

    // Decrypt phone number
    const decryptedTo = decrypt(encryptedTo);

    const payload = {
      messaging_product: "whatsapp",
      to: decryptedTo,
      type: "text",
      text: {
        body: message,
      },
    };

    const response = await whatsAppRepository.sendMessage(payload);

    // Save ONLY encrypted value
    await whatsAppRepository.saveOutgoingMessage({
      to: encryptedTo,
      type: "text",
      whatsappMessageId: response?.messages?.[0]?.id || null,
      status: "SENT",
      requestPayload: sanitizeOutgoingPayload(payload),
      responsePayload: sanitizeOutgoingPayload(response),
    });

    // Encrypt response back to client
    const encryptedResponse = encryptWhatsappResponseForClient(
      response,
      encryptedTo,
    );

    responseHandler.Ok(encryptedResponse, res);
  } catch (err) {
    handleError(res, err);
  }
};
// --- Template message
const sendTemplateMessage = async (req, res) => {
  try {
    const { to, name, discount } = req.body;
    const encryptedTo = encrypt(to);

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: "discount",
        language: { code: "en_US" },
        components: [
          { type: "header", parameters: [{ type: "text", text: name }] },
          { type: "body", parameters: [{ type: "text", text: discount }] },
        ],
      },
    };

    const response = await whatsAppRepository.sendMessage(payload);

    await whatsAppRepository.saveOutgoingMessage({
      to: encryptedTo,
      type: "template",
      whatsappMessageId: response?.messages?.[0]?.id || null,
      status: "SENT",
      requestPayload: sanitizeOutgoingPayload(payload),
      responsePayload: sanitizeOutgoingPayload(response),
    });

    const encryptedResponse = encryptWhatsappResponseForClient(
      response,
      encryptedTo,
    );
    responseHandler.Ok(encryptedResponse, res);
  } catch (err) {
    handleError(res, err);
  }
};

// --- Hello World Template
const sendHelloWorldTemplate = async (req, res) => {
  try {
    const { to: encryptedTo } = req.body;

    if (!encryptedTo) {
      return responseHandler.badRequest("Recipient is required", res);
    }

    const decryptedTo = decrypt(encryptedTo);

    const payload = {
      messaging_product: "whatsapp",
      to: decryptedTo,
      type: "template",
      template: {
        name: "hello_world",
        language: { code: "en_US" },
      },
    };

    const response = await whatsAppRepository.sendMessage(payload);

    await whatsAppRepository.saveOutgoingMessage({
      to: encryptedTo,
      type: "template",
      whatsappMessageId: response?.messages?.[0]?.id || null,
      status: "SENT",
      requestPayload: sanitizeOutgoingPayload(payload),
      responsePayload: sanitizeOutgoingPayload(response),
    });

    const encryptedResponse = encryptWhatsappResponseForClient(
      response,
      encryptedTo,
    );

    responseHandler.Ok(encryptedResponse, res);
  } catch (err) {
    handleError(res, err);
  }
};

// --- Unified Media Controller (Image / Document, Upload or Link)
const sendMediaController = async (req, res) => {
  try {
    const { to, link, caption, filename, type } = req.body;
    console.log("req.body", req.body);
    const encryptedTo = to;
    const decryptedTo = decrypt(to);

    let mediaResponse;
    if (req.file) {
      mediaResponse =
        type === "image"
          ? await whatsAppRepository.uploadImage(
              req.file.path,
              req.file.mimetype,
            )
          : await whatsAppRepository.uploadDocument(
              req.file.path,
              req.file.mimetype,
            );
    }

    const mediaUrl = req.file
      ? `${process.env.BASE_URL}/uploads/${req.file.filename}`
      : link || null;
    console.log("mediaUrl", mediaUrl);

    // Prepare WhatsApp payload
    let payload;
    if (type === "image") {
      payload = {
        messaging_product: "whatsapp",
        to: decryptedTo,
        type: "image",
        image: link
          ? { link }
          : { id: mediaResponse.id, ...(caption && { caption }) },
      };
    } else if (type === "document") {
      payload = {
        messaging_product: "whatsapp",
        to: decryptedTo,
        type: "document",
        document: link
          ? { link }
          : {
              id: mediaResponse.id,
              ...(caption && { caption }),
              ...(filename && { filename }),
            },
      };
    } else {
      throw new Error("Unsupported media type. Must be 'image' or 'document'.");
    }

    // Send message
    const sendResponse = await whatsAppRepository.sendMessage(payload);
    console.log(req.file.originalname);
    // Save outgoing message (store encrypted number)
    await whatsAppRepository.saveOutgoingMessage({
      to: encryptedTo,
      type,
      mediaUrl,
      whatsappMediaId: mediaResponse?.id || null,
      whatsappMessageId: sendResponse?.messages?.[0]?.id || null,
      status: "SENT",
      requestPayload: sanitizeOutgoingPayload(payload),
      responsePayload: sanitizeOutgoingPayload(sendResponse),
      fileName: filename || req.file?.originalname,
    });

    // Encrypt response for client
    const encryptedResponse = encryptWhatsappResponseForClient(
      sendResponse,
      encryptedTo,
    );

    responseHandler.Ok(encryptedResponse, res);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  sendTextMessage,
  sendTemplateMessage,
  sendHelloWorldTemplate,
  sendMediaController,
};
