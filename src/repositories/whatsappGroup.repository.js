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
  console.log(uniqueIds);
  // Validate users exist
  const users = await WhatsappUser.find({ _id: { $in: uniqueIds } });
  
  if (users.length !== uniqueIds.length) {
    console.log("Unique IDs requested:", uniqueIds);
    console.log("Users found in DB:", users.map(u => u._id.toString()));
    throw new Error(`One or more users do not exist. Found ${users.length} out of ${uniqueIds.length} requested.`);
  }

  // Build members list
  const members = uniqueIds.map((id) => ({
    userId: id,
    role: id === creatorId ? "ADMIN" : "MEMBER",
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
    .select("name members createdBy createdAt");

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
