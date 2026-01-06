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
      required: true,
    },
    messageType: {
      type: String,
      default: "text",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("whatsappGroupMessage", groupMessageSchema);
