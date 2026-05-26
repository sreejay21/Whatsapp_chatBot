const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

const apiId = Number(process.env.TELEGRAM_API_ID);

const apiHash =
  process.env.TELEGRAM_API_HASH;

const stringSession =
  new StringSession("");

let client = null;

const getClient = async () => {

  if (!client) {

    client = new TelegramClient(
      stringSession,
      apiId,
      apiHash,
      {
        connectionRetries: 5,
        useWSS: true
      }
    );

    await client.connect();

  }

  return client;
};

module.exports = { getClient };