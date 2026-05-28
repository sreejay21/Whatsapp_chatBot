const ConversationChat = require("../models/conversations.model");

const saveMessages = async (messages) => {
  if (!messages.length) {
    return;
  }

  const operations = messages.map((message) => ({
    updateOne: {
      filter: {
        userId: message.userId,
        chatId: message.chatId,
        messageId: message.messageId,
      },

      update: {
        $setOnInsert: message,
      },
      upsert: true,
    },
  }));

  return await ConversationChat.bulkWrite(operations);
};

module.exports = {
  saveMessages,
};
