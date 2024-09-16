import React, { useContext } from 'react';
import { NotificationContext } from '../../contexts/NotificationContext';
import { FaBell } from 'react-icons/fa';

const NotificationHeader = ({ onClick }) => {
  const { unreadCount } = useContext(NotificationContext);

  return (
    <div 
      className="relative cursor-pointer" 
      onClick={onClick}
    >
      {/* Always white bell for the header */}
      <FaBell className="text-2xl text-white" />
      
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationHeader;
