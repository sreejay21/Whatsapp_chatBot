const {
  sendGroupMessage,
  listGroupMessages,
  saveGroupMedia,
} = require("../repositories/whatsappGroupMessage.repository");
const { encrypt } = require("../crypto/crypto.util");
const responseHandler = require("../utils/response.handler");

const sendMessageToGroup = async (req, res) => {
  try {
    const { groupId,  message } = req.body || {};
    const file = req.file;
    const senderId = encrypt(req.user.nameid);

    if (!groupId || !senderId) {
      return responseHandler.badRequest(
        "groupId and senderId are required",
        res
      );
    }

    if (!message && !file) {
      return responseHandler.badRequest("Message or file is required", res);
    }

    let mediaUrl = null;
    let messageType = "text";

    if (file) {
      mediaUrl = `${process.env.BASE_URL}/uploads/${file.filename}`;
      messageType = file.mimetype.startsWith("image")
        ? "image"
        : "document";
    }

    const payload = {
      encryptedGroupId: groupId,
      encryptedSenderId: senderId,
      messageType,
      message,
      mediaUrl,
      fileName: file ? file.filename : null,
      size: file ? file.size : null,
    };

    const result = await sendGroupMessage(payload);

      if (!result.success) {
        return responseHandler.forbidden(
          res,
          result.message || "Member is not part of this group or group does not exist"
        );
      }


    const savedMessage = result.data;

    const responseData = {
      id: encrypt(savedMessage._id.toString()),
      groupId: encrypt(savedMessage.groupId.toString()),
      senderId: encrypt(savedMessage.senderId.toString()),
      message: savedMessage.message,
      senderName: savedMessage.senderName,
      groupName: savedMessage.groupName,
      mediaUrl: savedMessage.mediaUrl,
      messageType: savedMessage.messageType,
      createdAt: savedMessage.createdAt,
    };

    return responseHandler.Ok(responseData, res);
  } catch (error) {
    console.error("Error sending message to group:", error);
    return responseHandler.internalServerError(res);
  }
};


//List Group Messages
const getGroupMessages = async (req, res) => {
  try {
    const { groupId, page = 1, limit = 20 } = req.query;

    if (!groupId) return responseHandler.badRequest(res);

    const { messages, total, pages } = await listGroupMessages(
      groupId,
      Number(page),
      Number(limit),
    );

    const responseData = messages.map((msg) => ({
      id: encrypt(msg._id.toString()),
      groupId: encrypt(msg.groupId.toString()),
      senderId: encrypt(msg.senderId.toString()),
      senderName: msg.senderName,
      groupName: msg.groupName,
      message: msg.message,
      mediaUrl: msg.mediaUrl,
      messageType: msg.messageType,
      createdAt: msg.createdAt,
      fileName: msg.fileName,
      size: msg.size,
    }));

    return responseHandler.Ok(
      {
        success: true,
        data: responseData,
        pagination: {
          total,
          pages,
          page: Number(page),
          limit: Number(limit),
        },
      },
      res,
    );
  } catch (error) {
    console.error("Error fetching group messages:", error);
    return responseHandler.badRequest(res);
  }
};

module.exports = { sendMessageToGroup, getGroupMessages };
