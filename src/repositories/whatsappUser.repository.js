const WhatsappUser = require("../models/whatsappUser.model");

const findByEncryptedPhone = async (encryptedPhone) => {
  return await WhatsappUser.findOne({ encryptedPhone });
};

const createUser = async (payload) => {
  return await WhatsappUser.create(payload);
};

const updateUserName = async (userId, name) => {
  return await WhatsappUser.findByIdAndUpdate(userId, { name }, { new: true });
};

module.exports = {
  findByEncryptedPhone,
  createUser,
  updateUserName,
};
