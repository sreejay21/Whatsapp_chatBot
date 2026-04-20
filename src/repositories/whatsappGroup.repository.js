const whatsappGroup = require("../models/whatsappGroup.model");
const WhatsappUser = require("../models/whatsappUser.model");
const { decrypt } = require("../crypto/crypto.util");

const createGroup = async ({ name, members, createdBy, logo }) => {
  const creatorId = decrypt(createdBy);
  const creatorUser = await WhatsappUser.findById(creatorId);
  const memberUsers = await Promise.all(
    members.map(async (member) => {
      const source = member.source || "WHATSAPP";

      if (source === "WHATSAPP") {
        const decryptedUserId = decrypt(member.userId);
        const existingUser = await WhatsappUser.findById(decryptedUserId);
        return existingUser;
      }


      return WhatsappUser.findOneAndUpdate(
        {
          externalUserId: member.userId,
        },
        {
          $setOnInsert: {
            externalUserId: member.userId,
            name: member.name,
            source,
          },
        },
        {
          new: true,
          upsert: true,
        }
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
      .filter(user => user && !user._id.equals(creatorUser._id))
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
  });
};



const listAllGroups = async ({ page, limit }) => {
  const skip = (page - 1) * limit;

  const query = { isDeleted: false };

  const groups = await whatsappGroup
    .find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1, })
    .select("name members createdBy createdAt logo isDeleted")
   .populate({
    path: "members.userId",
    select: "encryptedPhone",
  });

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

const findById = async (decryptedGroupId) => {
  return await whatsappGroup.findById(decryptedGroupId);
}

module.exports = { createGroup, listAllGroups, findById };
