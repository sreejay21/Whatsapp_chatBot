const {encrypt} = require("../config/crypto.util");

const sanitizeWhatsAppPayload = (payload) => {
  if (!payload) return payload;
  const sanitized = JSON.parse(JSON.stringify(payload));

  if (sanitized.contacts?.[0]?.wa_id) {
    sanitized.contacts[0].wa_id = encrypt(sanitized.contacts[0].wa_id);
  }

  if (sanitized.messages?.[0]?.from) {
    sanitized.messages[0].from = encrypt(sanitized.messages[0].from);
  }

  return sanitized;
};

const sanitizeOutgoingPayload = (payload) => {
  if (!payload) return payload;

  const sanitized = JSON.parse(JSON.stringify(payload));

  if (sanitized.to) {
    sanitized.to = encrypt(sanitized.to);
  }

  if (sanitized.contacts?.[0]?.input) {
    sanitized.contacts[0].input = encrypt(sanitized.contacts[0].input);
  }
  
  if (sanitized.contacts?.[0]?.wa_id) {
    sanitized.contacts[0].wa_id = encrypt(sanitized.contacts[0].wa_id);
  }

  return sanitized;
};


module.exports = { sanitizeWhatsAppPayload, sanitizeOutgoingPayload };