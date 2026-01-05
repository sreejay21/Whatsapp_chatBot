const mongoose = require("mongoose");

const whatsappGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "WhatsappUser",
          required: true,
        },
        role: {
          type: String,
          enum: ["ADMIN", "MEMBER"],
          default: "MEMBER",
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
