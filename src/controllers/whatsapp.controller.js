const whatsappRepository = require("../repositories/whatsapp.repository");
const { env } = require("../config/env");
const { successResponse } = require("../utils/response.util");

const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === env.verifyToken) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
};

const receiveMessage = async (req, res) => {
  const message =
    req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!message) return res.sendStatus(200);

  const from = message.from;
  const text = message.text?.body;

  console.log(`Incoming message from ${from}: ${text}`);

  // Example auto-reply
  await whatsappRepository.sendTemplateMessage(
    from,
    "Thanks for your message 🙌"
  );

  res.sendStatus(200);
};

const sendMessage = async (req, res) => {
  try {
    const { to, template } = req.body
    await whatsappRepository.sendTemplateMessage(to, template);

    return successResponse(res, "Message sent successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to send message", error: error.message });
  }
}

module.exports = {
  verifyWebhook,
  receiveMessage,
  sendMessage,
};
