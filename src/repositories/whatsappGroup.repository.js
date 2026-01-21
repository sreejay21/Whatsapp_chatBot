const whatsappGroup = require("../models/whatsappGroup.model");
const WhatsappUser = require("../models/whatsappUser.model");
const { decrypt } = require("../config/crypto.util");

const createGroup = async ({ name, members, createdBy, logo }) => {
  const creatorId = decrypt(createdBy);


  const creatorUser = await WhatsappUser.findById(creatorId);
  if (!creatorUser) {
    throw new Error("Creator does not exist");
  }


  const memberUsers = await Promise.all(
    members.map(async (member) => {
      const source = member.source || "WHATSAPP";

      return WhatsappUser.findOneAndUpdate(
        {
          externalUserId: member.externalUserId,
          source,
        },
        {
          $setOnInsert: {
            externalUserId: member.externalUserId,
            name: member.name || "Unknown User",
            source,
          },
        },
        { new: true, upsert: true }
      );
    })
  );


  const groupMembers = [
    {
      userId: creatorUser._id,
      name: creatorUser.name,
      role: "ADMIN",
      source: creatorUser.source,
    },
    ...memberUsers
      .filter(user => !user._id.equals(creatorUser._id)) 
      .map(user => ({
        userId: user._id,
        name: user.name,
        role: "MEMBER",
        source: user.source,
      })),
  ];

  return whatsappGroup.create({
    name,
    members: groupMembers,
    createdBy: creatorUser._id,
    logo,
    source: "WHATSAPP",
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
