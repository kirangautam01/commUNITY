const { Server } = require('socket.io');
const User = require('../models/userModel');

function socketConfig(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const onlineUsers = new Map(); // username -> socketId

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('user-connected', async (userId) => {
      console.log("user-connected called with:", userId); // ✅ ADD THIS

      onlineUsers.set(userId, socket.id);
      try {
        await User.findByIdAndUpdate(userId, { isOnline: true });
        console.log(`currentuser is now online.`);
      } catch (err) {
        console.error("Failed to update user online status:", err);
      }
    });

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
      setTimeout(async () => {
        for (let [userId, socketId] of onlineUsers.entries()) {
          if (socketId === socket.id) {
            onlineUsers.delete(userId);
            try {
              await User.findByIdAndUpdate(userId, { isOnline: false });
              console.log(`User ${userId} is now offline.`);
            } catch (err) {
              console.error("Failed to set user offline:", err);
            }
            break;
          }
        }

        console.log('User disconnected:', socket.id);
      }, 0);
    });


  });

  return io;
}

module.exports = socketConfig;
