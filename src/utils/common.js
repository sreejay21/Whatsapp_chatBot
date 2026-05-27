const sendWhatsAppMessage = async (payload) => {
  try {
    return await whatsAppRepo.sendMessage(payload);
  } catch (error) {
    console.error("WhatsApp message error:", error);
    throw error;
  }
};

const sendMessage = (to, body) => {
  return sendWhatsAppMessage({
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body },
  });
};

const replyMessage = (to, body, messageId) => {
  return sendWhatsAppMessage({
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body },
    context: { message_id: messageId },
  });
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

const enums={
  interactiveTypes: {
    list_reply: 'list_reply',
    button_reply: 'button_reply'
  },
  userTypes: {
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    slack: 'Slack'
  },
  messageTypes: {
    text: 'text',
    image: 'image',
    document: 'document'
  }
  
}

module.exports={
    handleInteractiveMessage,
    handleTextMessage,
    enums
}