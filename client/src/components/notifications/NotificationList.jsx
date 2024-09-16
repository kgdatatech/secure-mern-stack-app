import React, { useContext, useEffect, useRef } from 'react';
import { NotificationContext } from '../../contexts/NotificationContext';
import NotificationItem from './NotificationItems';

const NotificationList = ({ toggleNotificationList }) => {
  const { notifications, markAsRead, deleteNotification } = useContext(NotificationContext);
  const listRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (listRef.current && !listRef.current.contains(event.target)) {
        toggleNotificationList();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleNotificationList]);

  return (
    <div ref={listRef} className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg overflow-hidden z-50 border border-gray-300">
      <ul>
        {notifications.length === 0 && <li className="text-black p-4">No notifications</li>}
        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            markAsRead={markAsRead}
            deleteNotification={deleteNotification}
            toggleNotificationList={toggleNotificationList} // Pass toggle function here
          />
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
