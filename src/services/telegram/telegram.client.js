const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

const apiId = Number(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;

const clients = new Map();

const getClient = async (sessionString) => {
  if (clients.has(sessionString)) {
    return clients.get(sessionString);
  }

  const client = new TelegramClient(
    new StringSession(sessionString),
    apiId,
    apiHash,
    {
      connectionRetries: 5,
      useWSS: true,
    },
  );

  await client.connect();

  clients.set(sessionString, client);

  return client;
};

const disconnectClient = async (sessionString) => {
  const client = clients.get(sessionString);

  if (client) {
    await client.disconnect();
    clients.delete(sessionString);
  }
};

module.exports = {
  getClient,
  disconnectClient,
};
