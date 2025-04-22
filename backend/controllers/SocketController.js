const User = require('../models/userModel');

exports.setUserOnline = async (userId) => {
    try {
        await User.findByIdAndUpdate(userId, { isOnline: true });
    } catch (err) {
        console.error('Failed to set user online:', err);
    }
};

exports.setUserOffline = async (userId) => {
    try {
        await User.findByIdAndUpdate(userId, { isOnline: false });
    } catch (err) {
        console.error('Failed to set user offline:', err); 
    }
};

// const { Server } = require('socket.io');

// function socketConfig(server) {
//   const io = new Server(server, {
//     cors: {
//       origin: process.env.FRONTEND_URL,
//       methods: ['GET', 'POST'],
//       credentials: true,
//     },
//   });

//   io.on('connection', async (socket) => {
//     console.log('User connected:', socket.id);

//     socket.on('join-room', (communityId) => {
//       socket.join(communityId);
//       console.log(`Socket ${socket.id} joined room ${communityId}`);
//     });

//     socket.on('send-message', ({ communityId, message, sender }) => {
//       io.to(communityId).emit('receive-message', {
//         message,
//         sender,
//         timestamp: new Date(),
//       });
//     });

//     socket.on('disconnect', async () => {
//       console.log('User disconnected:', socket.id);
//     });
//   });

//   return io;
// }

// module.exports = socketConfig;