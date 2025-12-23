const mongoose = require("mongoose");

const incomingWhatsappMessageSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "text",
        "image",
        "video",
        "audio",
        "document",
        "interactive",
        "status",
      ],
      required: true,
    },
    messageId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["sent", "delivered", "read", "failed", "unknown"],
      default: "delivered",
    },
    textBody: { type: String },
    interactiveData: { type: Object },
    statusData: { type: Object },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["sent", "delivered", "read", "failed", "unknown"],
        },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    rawPayload: { type: Object, required: true },
  },
  { timestamps: true },
);

const incomingWhatsappMessage = mongoose.model(
  "incomingWhatsappMessage",
  incomingWhatsappMessageSchema,
);

module.exports = incomingWhatsappMessage;
