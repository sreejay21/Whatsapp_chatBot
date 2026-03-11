const UserFiles = require("../models/userFiles.model");

const createUserFile = async ({
  userId,
  provider,
  name,
  contentType,
  size,
  blobName,
  providerFileId = null,
}) => {

  const file = await UserFiles.create({
    userId,
    provider,
    name,
    nameNormalized: name.toLowerCase(),
    contentType,
    size,
    blobName,
    providerFileId,
    source: "WHATSAPP",
    uploadedAt: new Date(),
    isProcessed: 0,
    isDeleted: false
  });

  return file;
};

module.exports = {
  createUserFile
};