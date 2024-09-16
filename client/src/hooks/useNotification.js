import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

export const useNotification = () => {
  const {
    notifications,
    unreadCount,
    isNotificationListOpen,
    toggleNotificationList,
    markAsRead,
    deleteNotification,
    fetchNotifications,
    clearNotification, // Ensure clearNotification is included
  } = useContext(NotificationContext);

  return {
    notifications,
    unreadCount,
    isNotificationListOpen,
    toggleNotificationList,
    markAsRead,
    deleteNotification,
    fetchNotifications,
    clearNotification, // Ensure clearNotification is returned
  };
};
