const { Server } = require('socket.io');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const { setUserOnline, setUserOffline } = require('../controllers/SocketController');

const JWT_SECRET = process.env.JWT_SECRECT_KEY;

function socketConfig(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', async (socket) => {
    console.log('User connected:', socket.id);

    try {
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) return;

      const parsedCookies = cookie.parse(cookies);
      const token = parsedCookies.token;
      console.log('token from socket: ', token);

      if (!token) return;

      const decoded = jwt.verify(token, JWT_SECRET); 
      const userId = decoded.userId;

      if (userId) {
        socket.userId = userId;

        console.log('userId from socket', socket.userId);
        // Set online status in DB
        await setUserOnline(userId);

        // Notify all clients
        io.emit('update-user-status', {
          userId,
          isOnline: true,
        });
      }
    } catch (err) {
      console.error('Socket auth error:', err.message);
    }

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

    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);

      if (socket.userId) {
        await setUserOffline(socket.userId);

        io.emit('update-user-status', {
          userId: socket.userId,
          isOnline: false,
        });
      }
    });
  });

  return io;
}

module.exports = socketConfig;
