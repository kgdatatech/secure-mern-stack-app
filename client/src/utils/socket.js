import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

// Use the socket URL from the environment variable
const socketUrl = import.meta.env.VITE_APP_SOCKET_URL;

const socket = io(socketUrl, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  path: '/socket.io',
  auth: {
    token: Cookies.get('jwt'), // Send JWT with socket connection for authentication
  },
});

export const joinConversationRoom = (conversationId) => {
  socket.emit('joinRoom', conversationId);
};

export const sendMessage = (recipientId, message) => {
  socket.emit('sendMessage', { recipientId, message });
};

socket.on('connect', () => {
  console.log('Connected to Socket.io server');
});

export const onNewMessage = (callback) => {
  socket.on('newMessage', callback);
};

export const leaveConversationRoom = (conversationId) => {
  socket.emit('leaveRoom', conversationId);
};

socket.on('reconnect', () => {
  console.log('Reconnected to Socket.io server');
});

socket.on('disconnect', (reason) => {
  console.log(`Disconnected: ${reason}`);
});

export default socket;
