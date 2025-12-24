const whatsappUserRepo = require("../repositories/whatsappUser.repository");
const { encrypt, decrypt } = require("../config/crypto.util");

const saveWhatsappUser = async (webhookValue) => {
  try {
    const contact = webhookValue?.contacts?.[0];
    if (!contact) return null;

    const waId = contact.wa_id;
    const encryptedPhone = encrypt(waId);
    const name = contact?.profile?.name || null;

    const existingUser =
      await whatsappUserRepo.findByEncryptedPhone(encryptedPhone);

    // 🔁 Update name if changed
    if (existingUser) {
      if (name && existingUser.name !== name) {
        return await whatsappUserRepo.updateUserName(existingUser._id, name);
      }
      return existingUser;
    }

    // 🆕 Create new user
    return await whatsappUserRepo.createUser({
      encryptedPhone,
      name,
    });
  } catch (err) {
    console.error("Error saving WhatsApp user:", err);
    return null;
  }
};

module.exports = {
  saveWhatsappUser,
};
