//client\src\hooks\useNotificationList.js

import notificationService from '../services/notificationService';

export const useNotificationList = (setNotifications, setUnreadCount) => {
  const fetchNotifications = async () => {
    try {
      const notifications = await notificationService.getNotifications();
      setNotifications(notifications);
      const unreadCount = notifications.filter(n => !n.isRead).length;
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return { fetchNotifications };
};
