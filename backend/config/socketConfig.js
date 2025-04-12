// socket.js
const { Server } = require('socket.io');

function socketConfig(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', (communityId) => {
      socket.join(communityId);
      console.log(`Socket ${socket.id} joined room ${communityId}`);
    });

    socket.on('send-message', ({ communityId, message, sender }) => {
      io.to(communityId).emit('receive-message', {
        message,
        sender,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
}

module.exports = socketConfig;
