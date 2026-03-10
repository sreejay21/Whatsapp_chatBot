const whatsappUserRepo = require("../repositories/whatsappUser.repository");
const { encrypt, decrypt } = require("../crypto/crypto.util");
const responseHandler = require("../utils/response.handler");

// Save or update WhatsApp user
const saveWhatsappUser = async (webhookValue) => {
  try {
    const contact = webhookValue?.contacts?.[0];
    if (!contact) return null;

    const waId = contact.wa_id;
    const encryptedPhone = encrypt(waId);
    const name = contact?.profile?.name || null;

    const existingUser =
      await whatsappUserRepo.findByEncryptedPhone(encryptedPhone);

    // Update name if changed
    if (existingUser) {
      if (name && existingUser.name !== name) {
        return await whatsappUserRepo.updateUserName(existingUser._id, name);
      }
      return existingUser;
    }

    //  Create new user
    return await whatsappUserRepo.createUser({
      encryptedPhone,
      name,
      source: "WHATSAPP",
    });
  } catch (err) {
    console.error("Error saving WhatsApp user:", err);
    return null;
  }
};

// List all WhatsApp users
const listWhatsappUsers = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const result = await whatsappUserRepo.listUsers({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    });

    const users = result.users.map((user) => ({
      ...user,
      _id: encrypt(user._id.toString()),
    }));

    return responseHandler.Ok({
      success: true,
      data: users,
      pagination: result.pagination,
    }, res);
  } catch (err) {
    console.error("Error listing WhatsApp users:", err);
    return responseHandler.internalServerError(res, "Failed to fetch WhatsApp users");
  }
};

module.exports = {
  saveWhatsappUser,
  listWhatsappUsers,
};
