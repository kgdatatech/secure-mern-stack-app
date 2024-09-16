import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell } from 'react-icons/fi'; // Import a bell icon

const NotificationItem = ({ notification, markAsRead, deleteNotification, toggleNotificationList }) => {
  const navigate = useNavigate();

  const handleViewClick = async () => {
    await markAsRead(notification._id); // Mark the notification as read
    toggleNotificationList(); // Close the notification list
    navigate('/dashboard?tab=messages', { replace: true }); // Navigate to the messages tab
    window.dispatchEvent(new Event('updateTab')); // Trigger a custom event to switch tabs
  };

  const handleDismissClick = () => {
    deleteNotification(notification._id);
    toggleNotificationList(); // Close the notification list after dismissing
  };

  return (
    <div className={`notification-item ${notification.isRead ? 'read' : 'unread'} p-4 border-b border-gray-300 bg-white rounded-md shadow-sm`}>
      <div className="flex items-center">
        <FiBell className="text-blue-500 mr-2" size={20} />
        <p className="text-black font-semibold">{notification.message}</p>
      </div>
      <div className="actions mt-2 flex justify-between border-t border-gray-200 pt-2">
        <button
          onClick={handleViewClick}
          className="text-blue-500 hover:text-blue-700 font-medium"
        >
          View
        </button>
        <button
          onClick={handleDismissClick}
          className="text-red-500 hover:text-red-700 font-medium"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
