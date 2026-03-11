const mongoose = require("mongoose");

const userFilesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    provider: {
      type: String,
      default: "WHATSAPP",
    },

    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    folderId: {
      type: String,
      default: null,
    },

    providerFileId: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      required: true,
    },

    nameNormalized: {
      type: String,
      default: null,
      index: true,
    },

    contentType: {
      type: String,
      default: null,
    },

    size: {
      type: Number,
      default: 0,
    },

    blobName: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      default: "WHATSAPP",
    },

    summary: {
      type: String,
      default: null,
    },

    extractedText: {
      type: String,
      default: null,
    },

    tokenCount: {
      type: Number,
      default: 0,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },

    lastSeenAt: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    tagIds: {
      type: [mongoose.Schema.Types.ObjectId],
      default: null,
    },

    hasAttachment: {
      type: Boolean,
      default: false,
    },

    parentProviderFieldId: {
      type: String,
      default: null,
    },

    parentFileId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    isProcessed: {
      type: Number,
      default: 0,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    createdByImpersonatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    modifiedByImpersonatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user-files", userFilesSchema);