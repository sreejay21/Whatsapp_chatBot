const whatsappGroup = require("../models/whatsappGroup.model");
const WhatsappUser = require("../models/whatsappUser.model");
const { decrypt } = require("../config/crypto.util");

const createGroup = async ({
  name,
  encryptedMemberIds,
  encryptedCreatorId,
  logo,
}) => {
  // Decrypt IDs
  const memberIds = encryptedMemberIds.map((id) => decrypt(id));
  const creatorId = decrypt(encryptedCreatorId);

  // Remove duplicates
  const uniqueIds = [...new Set([...memberIds, creatorId])];
  // Validate users exist
  const users = await WhatsappUser.find({ _id: { $in: uniqueIds } });
  if (users.length !== uniqueIds.length) {
    throw new Error("One or more users do not exist");
  }

  const members = users.map((user) => ({
    userId: user._id,
    name: user.name,
    role: user._id.toString() === creatorId.toString() ? "ADMIN" : "MEMBER",
  }));

  return whatsappGroup.create({
    name,
    members,
    createdBy: creatorId,
    logo,
  });
};

const listAllGroups = async ({ page, limit }) => {
  const skip = (page - 1) * limit;

  const groups = await whatsappGroup
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .select("name members createdBy createdAt logo");

  const total = await whatsappGroup.countDocuments();

  return {
    groups,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

module.exports = { createGroup, listAllGroups };
