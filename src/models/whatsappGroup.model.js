const mongoose = require("mongoose");

const whatsappGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    members: [
      {
        _id: false,

        userId: {
          type: String, 
          required: true,
        },

        userRefId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "WhatsappUser",
          default: null,
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
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("WhatsappGroup", whatsappGroupSchema);
