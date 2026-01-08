const mongoose = require("mongoose");

const groupMessageSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "whatsappGroup",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "whatsappUser",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    groupName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "document"],
      required: true,
    },
    mediaUrl: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("whatsappGroupMessage", groupMessageSchema);
