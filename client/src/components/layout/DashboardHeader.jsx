import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import NotificationBell from '../notifications/NotificationBell';
import NotificationList from '../notifications/NotificationList';
import { useNotification } from '../../hooks/useNotification';
import { FaLock } from 'react-icons/fa'; 
import { IoSunnyOutline, IoColorPaletteOutline, IoMoonOutline, IoLogOutOutline } from "react-icons/io5";

const DashboardHeader = () => {
  const { auth, logout } = useAuth();
  const { isNotificationListOpen, toggleNotificationList } = useNotification();
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState('light');

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    handleResize(); 
    window.addEventListener('resize', handleResize); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load the theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    }
  }, []);

  // Cycle through Light, Dark, and Colored modes, and store in localStorage
  const toggleTheme = () => {
    const root = document.documentElement;

    if (theme === 'light') {
      root.classList.remove('light');
      root.classList.add('dark');
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'dark') {
      root.classList.remove('dark');
      root.classList.add('colored'); 
      setTheme('colored');
      localStorage.setItem('theme', 'colored');
    } else {
      root.classList.remove('colored');
      root.classList.add('light');
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }
  };

  const getIcon = () => {
    if (theme === 'light') return <IoMoonOutline size={20} />; 
    if (theme === 'dark') return <IoColorPaletteOutline size={22} />; 
    return <IoSunnyOutline size={22} />; 
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 h-16 ${
        theme === 'colored' ? 'bg-indigo-950 border-lime-600' : 
        theme === 'dark' ? 'bg-darkBackground border-darkCard' : 
        'bg-gray-100 border-gray-300'
      } text-white z-50 flex items-center justify-between px-6`}
    >
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <FaLock size={28} 
            className={`${theme === 'colored' ? 'text-lime-600' : 'text-black dark:text-white'}`} 
            aria-label="Soccer Icon" 
          />
          {!isMobile && (
            <h1 className={`ml-2 text-xl ${theme === 'colored' ? 'text-white' : 'text-black dark:text-white'}`}>
              Secure MERN Stack
            </h1>
          )}
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className={`${theme === 'colored' ? 'text-white' : 'text-black dark:text-white'} `}
          aria-label="Toggle Theme"
        >
          {getIcon()}
        </button>

        {auth.user && (
          <>
            <div className="relative">
              <NotificationBell 
                aria-label="Notifications" 
                id="dashboard-notifications" 
                onClick={toggleNotificationList}
                theme={theme}
                className={`${theme === 'colored' ? 'text-yellow-400' : 'text-black dark:text-white'} hover:text-gray-300`} 
              />
              {isNotificationListOpen && (
                <div className={`absolute right-0 mt-2 w-64 ${
                  theme === 'colored' ? 'bg-indigo-500' : 'bg-white dark:bg-darkCard'
                } shadow-lg rounded-lg z-50`}>
                  <NotificationList toggleNotificationList={toggleNotificationList} />
                </div>
              )}
            </div>
            <button
              onClick={logout}
              className={`flex items-center space-x-2 text-gray-800 ${
                theme === 'colored' ? 'text-white' : 'dark:text-white'
              } `}
              title="Logout"
              aria-label="Logout"
              id="dashboard-logout"
            >
              <IoLogOutOutline size={20} />
              {!isMobile && <span>Logout</span>}
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
