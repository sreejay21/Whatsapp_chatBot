const { Server } = require('socket.io')
let io

module.exports = {
  init: (server) => {
    io = new Server(server, { cors: { origin: '*' } })
    io.on('connection', (socket) => {
      socket.on('join', (phone) => socket.join(phone))
    })
  },

  emitToUser: (phone, event, payload) => {
    io?.to(phone).emit(event, payload)
  }
}
