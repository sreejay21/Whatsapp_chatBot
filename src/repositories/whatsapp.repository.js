const axios = require("axios");
const { env } = require("../config/env");

const sendTemplateMessage = async (to, template) => {
  const url = `https://graph.facebook.com/v22.0/${env.phoneNumberId}/messages`;

  return axios.post(
    url,
    {
      messaging_product: "whatsapp",
      to,
      type: "template",
      template, 
    },
    {
      headers: {
        Authorization: `Bearer ${env.accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};

module.exports = {
  sendTemplateMessage,
};
