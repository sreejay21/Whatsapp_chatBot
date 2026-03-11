const responseHandler = require("../utils/response.handler");

// Encrypt WhatsApp response
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

// Parse encrypted phone numbers
const parsePhoneNumbers = (encryptedToRaw) => {
  if (!encryptedToRaw) return [];

  return encryptedToRaw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => decrypt(p.replace(/ /g, "+")));
};

// Build WhatsApp payload
const buildPayload = ({ to, type, caption, mediaUrl, mediaId, filename }) => {
  if (type === "text") {
    return {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: caption },
    };
  }

  if (type === "image") {
    return {
      messaging_product: "whatsapp",
      to,
      type: "image",
      image: mediaId
        ? { id: mediaId, ...(caption && { caption }) }
        : { link: mediaUrl, ...(caption && { caption }) },
    };
  }

  if (type === "document") {
    return {
      messaging_product: "whatsapp",
      to,
      type: "document",
      document: mediaId
        ? {
            id: mediaId,
            ...(caption && { caption }),
            ...(filename && { filename }),
          }
        : { link: mediaUrl },
    };
  }

  throw new Error("Unsupported media type");
};

module.exports={
  buildPayload,
  encryptWhatsappResponseForClient,
  handleError,
  parsePhoneNumbers
}