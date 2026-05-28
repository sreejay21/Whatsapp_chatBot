const { TelegramClient } = require('telegram')
const { StringSession } = require('telegram/sessions')
const { Api } = require('telegram')
const { decrypt } = require('../crypto/crypto.util')

class TelegramClientManager {
  constructor() {
    this.clients = new Map() // userId -> client
  }

  async getClient(user) {
    const userId = user._id.toString()

    if (this.clients.has(userId)) {
      return this.clients.get(userId)
    }

    if (!user.telegramSession) {
      throw new Error('No Telegram session found')
    }

    const sessionString = decrypt(user.telegramSession)

    const client = new TelegramClient(
      new StringSession(sessionString),
      process.env.TELEGRAM_API_ID,
      process.env.TELEGRAM_API_HASH,
      { connectionRetries: 5 }
    )

    await client.connect()

    this.clients.set(userId, client)

    return client
  }

  async saveClient(userId, client) {
    this.clients.set(userId, client)
  }

  async disconnect(userId) {
    const client = this.clients.get(userId)
    if (client) {
      await client.disconnect()
      this.clients.delete(userId)
    }
  }
}

module.exports = new TelegramClientManager()