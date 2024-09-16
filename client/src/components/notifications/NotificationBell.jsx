import React, { useContext } from 'react';
import { NotificationContext } from '../../contexts/NotificationContext';
import { IoIosNotificationsOutline } from "react-icons/io";

const NotificationBell = ({ onClick, theme, header = false }) => {
  const { unreadCount } = useContext(NotificationContext);

  return (
    <div 
      className="relative cursor-pointer" 
      onClick={onClick}
    >
      {/* Dynamically apply the bell color based on the theme or header */}
      <IoIosNotificationsOutline
        className={`text-2xl ${
          header
            ? 'text-yellow-400' // Always yellow in the header
            : theme === 'colored' 
              ? 'notification-bell-colored' 
              : theme === 'dark' 
                ? 'notification-bell-dark' 
                : 'notification-bell-light'
        }`}
      />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
