const mongoose = require("mongoose");

const whatsappUserSchema = new mongoose.Schema(
  {
    externalUserId: {
      type: String,
      unique: true,
      index: true,
    },

    encryptedPhone: {
      type: String,
      unique: true,
      sparse: true,
    },

    name: {
      type: String,
      trim: true,
    },

    source: {
      type: String,
      enum: ["WHATSAPP", "TELEGRAM", "SLACK"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WhatsappUser", whatsappUserSchema);
