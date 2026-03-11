const whatsAppRepository = require("../repositories/whatsappOutgoing.repository");
const whatsAppUserRepository = require("../repositories/whatsappUser.repository");
const { sendGroupMessage } = require("../repositories/whatsappGroupMessage.repository");
const { encrypt, decrypt } = require("../crypto/crypto.util");
const { sanitizeOutgoingPayload } = require("../config/whatsappPayload.util");
const responseHandler = require("../utils/response.handler");
const { renderTemplateMessage } = require("../utils/templateRenderer");
const {buildPayload,encryptWhatsappResponseForClient,parsePhoneNumbers,handleError}= require("../utils/helper")
const userFilesRepository = require("../repositories/userFilesRepository")


// --- Text Message Controller (Direct + Group)
const sendTextMessage = async (req, res) => {
  try {
    const {
      to: encryptedTo,
      message,
      groupId: encryptedGroupId,
    } = req.body;

    if (!message) {
      return responseHandler.badRequest("Message is required", res);
    }

    // Group Message

      if (encryptedGroupId) {
        const senderId = req.user?.nameid;
         const encryptedPhonesRaw = String(req.body.to || "");

        if (!senderId) {
          return responseHandler.unAuthorized("Unauthorized", res);
        }

        const encryptedSenderId = encrypt(senderId);

        // Save message ONCE
        const groupResult = await sendGroupMessage({
          encryptedGroupId,
          encryptedSenderId,
          message,
          messageType: "text",
        });

        if (!groupResult.success) {
          return responseHandler.getErrorResult(groupResult.message, res);
        }

        const phoneNumbers = encryptedPhonesRaw
            .split(",")
            .map(p => p.trim())
            .filter(Boolean)
            .map(p => decrypt(p.replace(/ /g, "+")));

        await Promise.allSettled(
          phoneNumbers.map(phone => {
            const payload = {
              messaging_product: "whatsapp",
              to: phone,
              type: "text",
              text: {
                body: message,
              },
            };

            return whatsAppRepository.sendMessage(payload);
          })
        );


        //  Response
        return responseHandler.Ok(
          {
            id: encrypt(groupResult.data._id.toString()),
            groupId: encrypt(groupResult.data.groupId.toString()),
            senderId: encrypt(groupResult.data.senderId.toString()),
            message: groupResult.data.message,
            messageType: groupResult.data.messageType,
            sentTo: phoneNumbers.length,    
          },
          res
        );
      }


   // Direct Message
    if (encryptedTo) {
      const decryptedTo = decrypt(encryptedTo);

      const payload = {
        messaging_product: "whatsapp",
        to: decryptedTo,
        type: "text",
        text: {
          body: message,
        },
      };

      const response = await whatsAppRepository.sendMessage(payload);
      const whatsappMessageId = response?.messages?.[0]?.id || null;

      try {
        const existingUser =
          await whatsAppUserRepository.findByEncryptedPhone(encryptedTo);

        if (!existingUser) {
          await whatsAppUserRepository.createUser({
            encryptedPhone: encryptedTo,
            source: "WHATSAPP",
            name: req.body.name || "",
            externalUserId: encryptedTo,
          });
        }
      } catch (e) {
        console.error(
          "Error ensuring whatsapp user exists:",
          e.message || e
        );
      }

      await whatsAppRepository.saveOutgoingMessage({
        to: encryptedTo,
        type: "text",
        whatsappMessageId,
        status: "SENT",
        requestPayload: sanitizeOutgoingPayload(payload),
        responsePayload: sanitizeOutgoingPayload(response),
      });

      const encryptedResponse =
        encryptWhatsappResponseForClient(response, encryptedTo);

      return responseHandler.Ok(encryptedResponse, res);
    }

    return responseHandler.badRequest(
      "Invalid payload. Provide (groupId + message) for group messages or (to + message) for direct messages",
      res
    );
  } catch (err) {
    handleError(res, err);
  }
};

// --- Template message
const sendTemplateMessage = async (req, res) => {
  try {
    const { to, name, discount } = req.body;
    const encryptedTo = encrypt(to);

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: "discount",
        language: { code: "en_US" },
        components: [
          { type: "header", parameters: [{ type: "text", text: name }] },
          { type: "body", parameters: [{ type: "text", text: discount }] },
        ],
      },
    };

    const response = await whatsAppRepository.sendMessage(payload);

    const renderedText =
      payload?.template
        ? renderTemplateMessage(payload.template)
        : null;


    await whatsAppRepository.saveOutgoingMessage({
      to: encryptedTo,
      type: "template",
      whatsappMessageId: response?.messages?.[0]?.id || null,
      status: "SENT",
      requestPayload: sanitizeOutgoingPayload(payload),
      responsePayload: sanitizeOutgoingPayload(response),
      text: renderedText,
    });

    const encryptedResponse = encryptWhatsappResponseForClient(
      response,
      encryptedTo,
    );
    responseHandler.Ok(encryptedResponse, res);
  } catch (err) {
    handleError(res, err);
  }
};

// --- Hello World Template
const sendwelcomeMessageTemplate = async (req, res) => {
  try {
    const { to: encryptedTo, name = "User" } = req.body;

    if (!encryptedTo) {
      return responseHandler.badRequest("Recipient is required", res);
    }

    const decryptedTo = decrypt(encryptedTo);

    const payload = {
      messaging_product: "whatsapp",
      to: decryptedTo,
      type: "template",
      template: {
        name: "ritro_welcome",
        language: { code: "en_US" },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: name,
              },
            ],
          },
        ],
      },
    };

    const templateForRender = JSON.parse(
      JSON.stringify(payload.template)
    );

    const renderedText = renderTemplateMessage(templateForRender);

    const response = await whatsAppRepository.sendMessage(payload);

    try {
      const existingUser =
        await whatsAppUserRepository.findByEncryptedPhone(encryptedTo);

      if (!existingUser) {
        await whatsAppUserRepository.createUser({
          encryptedPhone: encryptedTo,
          source: "WHATSAPP",
          name,
          externalUserId: encryptedTo,
        });
      }
    } catch (e) {
      console.error(
        "Error ensuring WhatsApp user exists:",
        e.message || e
      );
    }

    await whatsAppRepository.saveOutgoingMessage({
      to: encryptedTo,
      type: "template",
      whatsappMessageId: response?.messages?.[0]?.id || null,
      status: "SENT",
      text: renderedText,
      requestPayload: sanitizeOutgoingPayload(payload),
      responsePayload: sanitizeOutgoingPayload(response),
    });

    const responseData = {
      ...response,
      renderedText,
    };

    const encryptedResponse =
      encryptWhatsappResponseForClient(responseData, encryptedTo);

    return responseHandler.Ok(encryptedResponse, res);
  } catch (err) {
    handleError(res, err);
  }
};


const sendMediaController = async (req, res) => {
  try {
    const { to, groupId, link, caption, filename, type, name } = req.body;

    if (!groupId && !to) {
      return responseHandler.badRequest("Provide either 'to' or 'groupId'", res);
    }

    let mediaUrl = link || null;
    let mediaResponse = null;
    let userFileDoc = null;

    const senderId = req.user?.nameid;

    // ---------- FILE UPLOAD ----------
    if (req.file) {

      userFileDoc = await userFilesRepository.createUserFile({
        userId: senderId,
        name: req.file.originalname,
        contentType: req.file.mimetype,
        size: req.file.size,
        blobName: `uploads/${req.file.filename}`
      });

      const uploadFn =
        type === "image"
          ? whatsAppRepository.uploadImage
          : whatsAppRepository.uploadDocument;

      mediaResponse = await uploadFn(req.file.path, req.file.mimetype);

      mediaUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
    }

    // ---------- GROUP MESSAGE ----------
    if (groupId) {
      if (!senderId) {
        return responseHandler.unAuthorized("Unauthorized", res);
      }

      const encryptedSenderId = encrypt(senderId);

      const groupResult = await sendGroupMessage({
        encryptedGroupId: groupId,
        encryptedSenderId,
        message: caption || null,
        messageType: type,
        mediaUrl,
        fileName: req.file?.filename || null,
        size: req.file?.size || null,
      });

      if (!groupResult.success) {
        return responseHandler.getErrorResult(groupResult.message, res);
      }

      const phoneNumbers = parsePhoneNumbers(req.body.to);

      await Promise.allSettled(
        phoneNumbers.map((phone) =>
          whatsAppRepository.sendMessage(
            buildPayload({ to: phone, type, caption, mediaUrl })
          )
        )
      );

      return responseHandler.Ok(
        {
          id: encrypt(groupResult.data._id.toString()),
          groupId: encrypt(groupResult.data.groupId.toString()),
          senderId: encrypt(groupResult.data.senderId.toString()),
          message: groupResult.data.message,
          senderName: groupResult.data.senderName,
          groupName: groupResult.data.groupName,
          messageType: groupResult.data.messageType,
          mediaUrl,
          sentTo: phoneNumbers.length,
        },
        res
      );
    }

    // ---------- DIRECT MESSAGE ----------
    if (to) {
      const decryptedTo = decrypt(to);

      const payload = buildPayload({
        to: decryptedTo,
        type,
        caption,
        mediaUrl,
        mediaId: mediaResponse?.id,
        filename,
      });

      const sendResponse = await whatsAppRepository.sendMessage(payload);

      const existingUser =
        await whatsAppUserRepository.findByEncryptedPhone(to);

      if (!existingUser) {
        await whatsAppUserRepository.createUser({
          encryptedPhone: to,
          source: "WHATSAPP",
          name: name || "",
          externalUserId: to,
        });
      }

      await whatsAppRepository.saveOutgoingMessage({
        to,
        type,
        mediaUrl,
        userFileId: userFileDoc?._id || null,
        whatsappMediaId: mediaResponse?.id || null,
        whatsappMessageId: sendResponse?.messages?.[0]?.id || null,
        status: "SENT",
        requestPayload: sanitizeOutgoingPayload(payload),
        responsePayload: sanitizeOutgoingPayload(sendResponse),
        fileName: req.file?.filename || null,
        size: req.file?.size || null,
      });

      const encryptedResponse = encryptWhatsappResponseForClient(
        sendResponse,
        to
      );

      return responseHandler.Ok(encryptedResponse, res);
    }
  } catch (err) {
    handleError(res, err);
  }
};


module.exports = {
  sendTextMessage,
  sendTemplateMessage,
  sendwelcomeMessageTemplate,
  sendMediaController,
};
