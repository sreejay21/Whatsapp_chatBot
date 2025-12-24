const mongoose = require("mongoose");

const whatsappUserSchema = new mongoose.Schema(
  {
    encryptedPhone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("WhatsappUser", whatsappUserSchema);
