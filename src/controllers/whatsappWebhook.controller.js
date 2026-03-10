const whatsAppRepo = require("../repositories/whatsappWebhook.repository");
const { encrypt, decrypt } = require("../crypto/crypto.util");
const { sanitizeWhatsAppPayload } = require("../config/whatsappPayload.util");
const { saveWhatsappUser } = require("../controllers/whatsappUser.controller");
const responseHandler = require("../utils/response.handler");
const whatsappMediaRepo = require("../repositories/whatsappMedia.respository");
const {handleTextMessage, handleInteractiveMessage} = require("../utils/common")

// Webhook verification
const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];

  if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
};

// Webhook handler
const handleWebhook = async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const value = entry?.changes?.[0]?.value;
    if (!value) return responseHandler.noContent(res);

    const statuses = value.statuses?.[0];
    const messages = value.messages?.[0];

    // ===== Handle Incoming Messages (SAVE ONCE) =====
    if (messages) {
      const encryptedFrom = encrypt(messages.from);
      let mediaData = null;

      if (messages.type === "image" || messages.type === "document") {
        const media = messages[messages.type];

        mediaData = await whatsappMediaRepo.downloadWhatsAppMedia(
          media.id,
          media.mime_type,
        );
      }
      await whatsAppRepo.saveIncomingMessage({
        from: encryptedFrom,
        type: messages.type,
        messageId: messages.id,

        mediaUrl: mediaData?.url || null,

        fileName: mediaData?.fileName || null,
        size: mediaData?.size || null,
        mediaMeta: mediaData
          ? {
              mediaId: messages[messages.type].id,
              mimeType: messages[messages.type].mime_type,
              sha256: messages[messages.type].sha256,
            }
          : null,

        rawPayload: sanitizeWhatsAppPayload(value),
      });

      await saveWhatsappUser(value);

      if (messages.type === "text") {
        await handleTextMessage(messages);
      }

      if (messages.type === "interactive") {
        await handleInteractiveMessage(messages);
      }
    }

    // ===== Handle Status Updates (UPDATE ONLY) =====
    if (statuses) {
      const allowedStatuses = ["sent", "delivered", "read", "failed"];
      const messageStatus = allowedStatuses.includes(statuses.status)
        ? statuses.status
        : "unknown";

      await whatsAppRepo.updateMessageStatus(
        statuses.id,
        messageStatus,
        statuses,
      );
    }

    responseHandler.Ok("Webhook processed", res);
  } catch (err) {
    console.error(err);
    responseHandler.internalServerError(res, err.message);
  }
};





module.exports = { verifyWebhook, handleWebhook };
