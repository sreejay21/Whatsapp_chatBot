const mongoose = require("mongoose");

const whatsappGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    members: [
      {
        _id: false, 
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "WhatsappUser",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        role: {
          type: String,
          enum: ["ADMIN", "MEMBER"],
          default: "MEMBER",
        },

        source: {
          type: String,
          enum: ["WHATSAPP", "TELEGRAM", "SLACK"],
          required: true,
        },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WhatsappUser",
      required: true,
    },
    logo: { type: String, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("WhatsappGroup", whatsappGroupSchema);
