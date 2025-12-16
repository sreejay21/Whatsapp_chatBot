const messageRepo = require('../repositories/message.repository')
const chatRepo = require('../repositories/chat.repository')
const socket = require('../socket')

module.exports = {
  saveIncoming: async (msg) => {
    await messageRepo.create(msg)
    await chatRepo.upsert(msg.phone, msg.message)
    socket.emitToUser(msg.phone, 'new_message', msg)
  }
}
