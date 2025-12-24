const whatsAppRepo = require("../repositories/whatsappWebhook.repository");
const { encrypt, decrypt } = require("../config/crypto.util");
const { sanitizeWhatsAppPayload } = require("../config/whatsappPayload.util");
const { saveWhatsappUser } = require("../controllers/whatsappUser.controller");

// Webhook verification
const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];

  if (mode && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
};

// Webhook handler
const handleWebhook = async (req, res) => {
  try {
    // Log the full incoming payload
    console.log("=== Incoming Webhook ===");
    console.log(JSON.stringify(req.body, null, 2));
    const entry = req.body.entry?.[0];
    const value = entry?.changes?.[0]?.value;
    if (!value) return res.sendStatus(200);

    const statuses = value.statuses?.[0];
    const messages = value.messages?.[0];

    // ===== Handle Incoming Messages (SAVE ONCE) =====
    if (messages) {
      const encryptedFrom = encrypt(messages.from);
      await whatsAppRepo.saveIncomingMessage({
        from: encryptedFrom,
        type: messages.type,
        messageId: messages.id,
        textBody: messages.type === "text" ? messages.text.body : undefined,
        interactiveData:
          messages.type === "interactive" ? messages.interactive : undefined,
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

      console.log(`Message ${statuses.id} updated to status: ${messageStatus}`);
    }

    res.status(200).send("Webhook processed");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

// ===== Dynamic Text Message Handler =====
const handleTextMessage = async (messages) => {
  const text = messages.text.body.trim().toLowerCase();
  const from = messages.from;
  const messageId = messages.id;

  let reply = null;

  // Handle greetings
  if (/(^|\s)(hi|hii|hello|hey)(\s|$)/i.test(text)) {
    reply = "Hi How can We help You?";
  }

  // Send reply only if matched
  if (reply) {
    await replyMessage(from, reply, messageId);
  }
};

// ===== Interactive Message Handler =====
const handleInteractiveMessage = async (messages) => {
  const from = messages.from;
  const interactive = messages.interactive;

  if (interactive.type === "list_reply") {
    await sendMessage(
      from,
      `You selected the option with ID ${interactive.list_reply.id} - Title ${interactive.list_reply.title}`,
    );
  }

  if (interactive.type === "button_reply") {
    await sendMessage(
      from,
      `You selected the button with ID ${interactive.button_reply.id} - Title ${interactive.button_reply.title}`,
    );
  }
};

// ===== Helper functions using repo =====
const sendMessage = async (to, body) => {
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body },
  };
  return await whatsAppRepo.sendMessage(payload);
};

const replyMessage = async (to, body, messageId) => {
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body },
    context: { message_id: messageId },
  };
  return await whatsAppRepo.sendMessage(payload);
};

const sendList = async (to) => {
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "list",
      header: { type: "text", text: "Message Header" },
      body: { text: "This is a interactive list message" },
      footer: { text: "This is the message footer" },
      action: {
        button: "Tap for the options",
        sections: [
          {
            title: "First Section",
            rows: [
              {
                id: "first_option",
                title: "First option",
                description: "This is the description of the first option",
              },
              {
                id: "second_option",
                title: "Second option",
                description: "This is the description of the second option",
              },
            ],
          },
          {
            title: "Second Section",
            rows: [{ id: "third_option", title: "Third option" }],
          },
        ],
      },
    },
  };
  return await whatsAppRepo.sendMessage(payload);
};

const sendReplyButtons = async (to) => {
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      header: { type: "text", text: "Message Header" },
      body: { text: "This is a interactive reply buttons message" },
      footer: { text: "This is the message footer" },
      action: {
        buttons: [
          {
            type: "reply",
            reply: { id: "first_button", title: "First Button" },
          },
          {
            type: "reply",
            reply: { id: "second_button", title: "Second Button" },
          },
        ],
      },
    },
  };
  return await whatsAppRepo.sendMessage(payload);
};

module.exports = { verifyWebhook, handleWebhook };
