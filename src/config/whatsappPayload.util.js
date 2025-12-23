const sanitizeWhatsAppPayload = (payload) => {
  if (!payload) return payload;
  const sanitized = JSON.parse(JSON.stringify(payload));

  if (sanitized.contacts?.[0]?.wa_id) {
    sanitized.contacts[0].wa_id = "REDACTED";
  }

  if (sanitized.messages?.[0]?.from) {
    sanitized.messages[0].from = "REDACTED";
  }

  return sanitized;
};

const sanitizeOutgoingPayload = (payload) => {
  if (!payload) return payload;

  const sanitized = JSON.parse(JSON.stringify(payload));

  if (sanitized.to) {
    sanitized.to = "REDACTED";
  }

  if (sanitized.contacts?.[0]?.input) {
    sanitized.contacts[0].input = "REDACTED";
  }

  if (sanitized.contacts?.[0]?.wa_id) {
    sanitized.contacts[0].wa_id = "REDACTED";
  }

  return sanitized;
};


module.exports = { sanitizeWhatsAppPayload, sanitizeOutgoingPayload };