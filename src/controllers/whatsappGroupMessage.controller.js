const {
  sendGroupMessage,
  listGroupMessages,
} = require("../repositories/whatsappGroupMessage.repository");
const { encrypt } = require("../config/crypto.util");
const responseHandler = require("../utils/response.handler");

// Send Message to Group
const sendMessageToGroup = async (req, res) => {
  try {
    const { groupId, senderId, message } = req.body;

    const result = await sendGroupMessage({
      encryptedGroupId: groupId,
      encryptedSenderId: senderId,
      message,
    });

    const responseData = {
      id: encrypt(result.data.id.toString()),
      groupId: encrypt(result.data.groupId.toString()),
      senderId: encrypt(result.data.senderId.toString()),
      message: result.data.message,
      senderName: result.data.senderName,
      groupName: result.data.groupName,
    };

    return responseHandler.Ok(responseData, res);
  } catch (error) {
    console.error("Error sending message to group:", error);
    return responseHandler.badRequest(res);
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
