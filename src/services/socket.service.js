let ioInstance = null

const socketService = {

  /**
   * Initialize socket.io
   */
  init (io) {
    ioInstance = io

    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id)

      // Join user room (phone-based)
      socket.on('join', (phone) => {
        socket.join(phone)
        console.log(`User joined room: ${phone}`)
      })

      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id)
      })
    })
  },

  /**
   * Emit new message to specific phone room
   */
  emitNewMessage (phone, message) {
    if (!ioInstance) return

    ioInstance.to(phone).emit('new_message', message)
  },

  /**
   * Emit chat list update
   */
  emitChatUpdate (chat) {
    if (!ioInstance) return

    ioInstance.emit('chat_update', chat)
  }

}

module.exports = socketService
