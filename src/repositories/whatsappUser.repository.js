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

const listUsers = async ({ page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  const filter = { source: "WHATSAPP", isDeleted: false };

  const [users, total] = await Promise.all([
    WhatsappUser.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    WhatsappUser.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const findByUserId = async (encryptedPhone) => {
  return await WhatsappUser.findOne({ encryptedPhone });
}

const findByUserIds = async (userIds) => {
  return await WhatsappUser.find({ _id : { $in: userIds } });
};

module.exports = {
  findByEncryptedPhone,
  createUser,
  updateUserName,
  listUsers,
  findByUserId,
  findByUserIds
};
