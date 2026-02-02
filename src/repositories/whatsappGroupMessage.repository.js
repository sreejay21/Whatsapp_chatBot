const whatsappGroup = require("../models/whatsappGroup.model");
const GroupMessage = require("../models/whatsappGroupMessage.model");
const WhatsappUser = require("../models/whatsappUser.model");
const { decrypt } = require("../config/crypto.util");
const fs = require("fs");
const path = require("path");

const sendGroupMessage = async ({
  encryptedGroupId,
  encryptedSenderId, 
  message,
  messageType,
  mediaUrl = null,
}) => {
  try {
    const groupId = decrypt(encryptedGroupId);
    const senderId = decrypt(encryptedSenderId)

    const group = await whatsappGroup
      .findById(groupId)
      .select("name members");

    if (!group) {
      return {
        success: false,
        statusCode: 404,
        message: "Group not found",
      };
    }

    const sender = await WhatsappUser
      .findById(senderId)
      .select("name");

    if (!sender) {
      return {
        success: false,
        statusCode: 404,
        message: "Sender not found",
      };
    }


    const isMember = group.members.some(
      (m) => m.userId.toString() === senderId.toString()
    );

    if (!isMember) {
      return {
        success: false,
        statusCode: 403,
        message: "Sender is not a member of this group",
      };
    }

    const groupMessage = await GroupMessage.create({
      groupId,
      senderId,
      senderName: sender.name,
      groupName: group.name,
      message: messageType === "text" ? message : null,
      messageType,
      mediaUrl,
    });

    return {
      success: true,
      statusCode: 201,
      message: "Message sent to group",
      data: groupMessage,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Internal server error",
    };
  }
};



const  listGroupMessages = async (encryptedGroupId, page = 1, limit = 20) => {
  const groupId = decrypt(encryptedGroupId);
  const skip = (page - 1) * limit;

  const messages = await GroupMessage.find({ groupId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("_id groupId senderId senderName groupName message mediaUrl messageType createdAt");

  const total = await GroupMessage.countDocuments({ groupId });

  return {
    messages,
    total,
    pages: Math.ceil(total / limit),
    page,
    limit,
  };
};

const saveGroupMedia = (file) => {
  if (!file) return null;

  const ext = path.extname(file.originalname);
  const storedFileName = `${crypto.randomUUID()}${ext}`;

  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const finalPath = path.join(uploadDir, storedFileName);
  fs.renameSync(file.path, finalPath);

  return {
    storedFileName,
    mediaMeta: {
      mimeType: file.mimetype,
      originalName: file.originalname,
    },
  };
};

module.exports = { sendGroupMessage, listGroupMessages, saveGroupMedia };
