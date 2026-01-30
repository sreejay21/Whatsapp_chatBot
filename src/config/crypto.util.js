const crypto = require("crypto");

const ALGORITHM = "aes-256-cbc";

const KEY_HEX = "3b42c587ba9fc0090539f814ea50336148fa166e0f79de55408ebdd85541a29f";
const IV_HEX  = "448772692e85e0d64bc2f5c263fe4b02";
const KEY = Buffer.from(KEY_HEX, "hex");
const IV  = Buffer.from(IV_HEX, "hex");  

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};

const decrypt = (encryptedText) => {
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports = { encrypt, decrypt };
