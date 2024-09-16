// client/src/contexts/SocketContext.jsx
import React, { createContext, useContext, useEffect, useCallback } from 'react';
import socket from '../utils/socket';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();

  const joinRoom = useCallback(() => {
    if (currentUser) {
      socket.emit('joinRoom', currentUser._id);
    }
  }, [currentUser]);

  const leaveRoom = useCallback(() => {
    if (currentUser) {
      socket.emit('leaveRoom', currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      joinRoom();

      socket.on('newMessage', (message) => {
        console.log('New message received:', message);
        // Implement message handling logic here (e.g., update state, notify user)
      });

      socket.on('newNotification', (notification) => {
        console.log('New notification received:', notification);
        addNotification(notification);
      });
    }

    return () => {
      leaveRoom();
      socket.off('newMessage');
      socket.off('newNotification');
    };
  }, [currentUser, joinRoom, leaveRoom, addNotification]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext };
