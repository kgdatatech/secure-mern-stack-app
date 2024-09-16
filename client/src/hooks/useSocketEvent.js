import { useContext, useEffect, useCallback } from 'react';
import { SocketContext } from '../contexts/SocketContext';

export const useSocketEvent = (event, callback) => {
  const socket = useContext(SocketContext);

  const memoizedCallback = useCallback(callback, [callback]);

  useEffect(() => {
    if (socket) {
      socket.on(event, memoizedCallback);
    }

    return () => {
      if (socket) {
        socket.off(event, memoizedCallback);
      }
    };
  }, [socket, event, memoizedCallback]);
};
