const whatsappGroup = require("../models/whatsappGroup.model");
const GroupMessage = require("../models/whatsappGroupMessage.model");
const WhatsappUser = require("../models/whatsappUser.model");
const { decrypt } = require("../config/crypto.util");

const sendGroupMessage = async ({
  encryptedGroupId,
  encryptedSenderId,
  message,
}) => {
  const groupId = decrypt(encryptedGroupId);
  const senderId = decrypt(encryptedSenderId);

  const group = await whatsappGroup.findById(groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  const sender = await WhatsappUser.findById(senderId).select("name");
  const groupName = await whatsappGroup.findById(groupId).select("name");

  // Check sender is a member
  const isMember = group.members.some(
    (m) => m.userId.toString() === senderId.toString(),
  );

  if (!isMember) {
    throw new Error("Sender is not a member of this group");
  }

  // Save message
  const groupMessage = await GroupMessage.create({
    groupId,
    senderId,
    message,
    senderName: sender.name,
    groupName: groupName.name,
  });

  return {
    success: true,
    message: "Message sent to group",
    data: groupMessage,
  };
};

const listGroupMessages = async (encryptedGroupId, page = 1, limit = 20) => {
  const groupId = decrypt(encryptedGroupId);
  const skip = (page - 1) * limit;

  const messages = await GroupMessage.find({ groupId })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .select("_id groupId senderId senderName groupName message");

  const total = await GroupMessage.countDocuments({ groupId });

  return {
    messages,
    total,
    pages: Math.ceil(total / limit),
    page,
    limit,
  };
};

module.exports = { sendGroupMessage, listGroupMessages };
