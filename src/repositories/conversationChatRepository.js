const ConversationChat = require("../models/conversations.model");
const mongoose = require("mongoose");

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

const fetchSyncedChats = async ({ userId, page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    ConversationChat.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ messageDate: -1 })
      .skip(skip)
      .limit(limit),

    ConversationChat.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
    }),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  saveMessages,
  fetchSyncedChats,
};
