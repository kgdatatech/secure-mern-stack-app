import React, { createContext, useState, useEffect, useContext } from 'react';
import notificationService from '../services/notificationService';
import { useSocket } from './SocketContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationListOpen, setNotificationListOpen] = useState(false);
  const socket = useSocket();

  const toggleNotificationList = () => {
    setNotificationListOpen(!isNotificationListOpen);
  };

  const fetchNotifications = async () => {
    try {
      const fetchedNotifications = await notificationService.getNotifications();
      setNotifications(fetchedNotifications);
      setUnreadCount(fetchedNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      // console.error('Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const notification = notifications.find(notif => notif._id === id);
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
      
      // Update unread count if the deleted notification was unread
      if (!notification.isRead) {
        setUnreadCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const clearNotification = async (notificationId) => {
    try {
      const notification = notifications.find(notif => notif._id === notificationId);
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));

      if (!notification.isRead) {
        setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
      }
    } catch (error) {
      console.error('Failed to clear notification:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    if (socket) {
      socket.on('newNotification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      return () => {
        socket.off('newNotification');
      };
    }
  }, [socket]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isNotificationListOpen,
        toggleNotificationList,
        markAsRead,
        deleteNotification,
        clearNotification,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
