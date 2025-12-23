const mongoose = require("mongoose");

const outgoingWhatsappMessageSchema = new mongoose.Schema(
  {
    to: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "template", "image"],
      required: true,
    },
    requestPayload: {
      type: Object,
      required: true,
    },
    responsePayload: {
      type: Object,
    },
    whatsappMessageId: {
      type: String,
    },
    status: {
      type: String,
      default: "SENT",
    },
  },
  { timestamps: true },
);

const outgoingWhatsappMessage = mongoose.model(
  "outgoingWhatsappMessage",
  outgoingWhatsappMessageSchema,
);

module.exports = outgoingWhatsappMessage;
