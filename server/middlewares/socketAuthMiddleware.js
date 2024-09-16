const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticateSocketConnection = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.user = user; // Attach the user object to the socket
    next();
  } catch (error) {
    next(new Error('Authentication error: ' + error.message));
  }
};

// Placeholder: Middleware extension for role-based socket authentication
// exports.adminSocketAuth = (socket, next) => {
//   if (socket.user.role !== 'admin') {
//     return next(new Error('Authorization error'));
//   }
//   next();
// };
