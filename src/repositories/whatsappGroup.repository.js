const whatsappGroup = require("../models/whatsappGroup.model");
const WhatsappUser = require("../models/whatsappUser.model");
const { decrypt } = require("../crypto/crypto.util");

const createGroup = async ({ name, members, createdBy, logo }) => {
  const creatorId = decrypt(createdBy);
  const creatorUser = await WhatsappUser.findById(creatorId);

  if (!creatorUser) {
    throw new Error("Creator not found");
  }

  const processedMembers = await Promise.all(
    members.map(async (member) => {
      const source = member.source?.toUpperCase();

      if (source === "WHATSAPP") {
        const decryptedUserId = decrypt(member.userId);
        const user = await WhatsappUser.findById(decryptedUserId);

        if (!user) return null;

        return {
          userId: user._id.toString(),   // string now safe
          userRefId: user._id,
          name: user.name,
          source,
        };
      }

      // TELEGRAM / SLACK
      const user = await WhatsappUser.findOneAndUpdate(
  {
    externalUserId: member.userId,
    source: source, // 👈 IMPORTANT FIX
  },
  {
    $setOnInsert: {
      externalUserId: member.userId,
      name: member.name,
      source,
    },
  },
  { new: true, upsert: true }
);
      return {
        userId: member.userId,   
        userRefId: user._id,
        name: member.name,
        source,
      };
    })
  );

  const validMembers = processedMembers.filter(Boolean);

  const groupMembers = [
    {
      userId: creatorUser._id.toString(),
      userRefId: creatorUser._id,
      name: creatorUser.name,
      role: "ADMIN",
      source: creatorUser.source,
    },

    ...validMembers
      .filter((m) => m.userId !== creatorUser._id.toString())
      .map((m) => ({
        userId: m.userId,
        userRefId: m.userRefId,
        name: m.name,
        role: "MEMBER",
        source: m.source,
      })),
  ];

  const group = await whatsappGroup.create({
    name,
    members: groupMembers,
    createdBy: creatorUser._id,
    logo,
  });

  return group;
};


const listAllGroups = async ({ page, limit }) => {
  const skip = (page - 1) * limit;

  const query = { isDeleted: false };

  const groups = await whatsappGroup
    .find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .select("name members createdBy createdAt logo isDeleted")
    .lean(); 

  const total = await whatsappGroup.countDocuments(query);


  for (const group of groups) {
    for (const member of group.members) {
      if (member.source === "WHATSAPP" && member.userRefId) {
        const user = await WhatsappUser.findById(member.userRefId)
          .select("encryptedPhone name");

        member.user = user || null;
      }
    }
  }

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
