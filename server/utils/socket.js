// server\utils\socket.js

const socketio = require('socket.io');
const { authenticateSocketConnection } = require('../middlewares/socketAuthMiddleware'); // Assuming middleware is in 'middlewares/socketauthMiddleware.js'

const initializeSocket = (httpsServer) => {
  const io = socketio(httpsServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
    path: '/socket.io',
  });

  // Middleware for authenticating socket connections
  io.use(authenticateSocketConnection);

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user._id}`); // Access user details from the socket

    // Join room based on user ID for private messaging
    socket.on('joinRoom', (userId) => {
      socket.join(userId);
      console.log(`User with ID: ${userId} joined their private room.`);
    });

    // Handle sending messages - message contains the recipient's userId
    socket.on('sendMessage', ({ recipientId, message }) => {
      io.to(recipientId).emit('newMessage', message);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user._id}`);
    });
  });

  return io;
};

module.exports = initializeSocket;
