import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaLock } from "react-icons/fa";
import NotificationHeader from '../notifications/NotificationHeader';
import NotificationList from '../notifications/NotificationList';
import MobileMenu from './MobileMenu';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaSignOutAlt, FaBars, FaClipboardList } from 'react-icons/fa';
import { IoMdStarOutline } from "react-icons/io";
import { GrResources } from "react-icons/gr";

const Header = () => {
  const { auth, logout } = useAuth();
  const { isNotificationListOpen, toggleNotificationList } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
    if (window.innerWidth >= 768) {
      setMobileMenuOpen(false); // Close mobile menu on resize to desktop
    }
  };

  useEffect(() => {
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize); // Listen for resize events
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className={`bg-gray-950 text-white border-b border-gray-300 ${isMobile ? 'h-16' : 'h-24'} flex items-center sticky top-0 z-50`}>
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="flex items-center space-x-2 md:space-x-4" aria-label="Secure MERN Stack Home" id="header-logo">
          <FaLock className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12 md:w-12 md:h-12 text-yellow-400'}`} />
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-sans">Your Business Name</h1>
        </Link>

        {/* Mobile - Notification Bell and Hamburger Icon */}
        {isMobile && (
          <div className="flex items-center space-x-4">
            {auth.user && ( // Show notification bell only if user is logged in
              <div className="relative">
                <NotificationHeader aria-label="Notifications" id="nav-notifications-mobile" color="text-white"/>
                {isNotificationListOpen && (
                  <div className="normal-case">
                    <NotificationList toggleNotificationList={toggleNotificationList} />
                  </div>
                )}
              </div>
            )}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-white" 
              aria-label="Open Mobile Menu"
            >
              <FaBars size={24} />
            </button>
          </div>
        )}

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex items-center space-x-2 sm:space-x-4 md:space-x-4 font-sans font-bold tracking-narrow text-xs sm:text-sm md:text-base lg:text-m">
            {!auth.user && (
              <>
                <Link
                  to="/about"
                  className="transition duration-300 ease-in-out transform hover:scale-105 hover:text-blue-300 flex items-center"
                  aria-label="About"
                  id="nav-about"
                >
                  Why Choose Us? <IoMdStarOutline size={14} className="ml-1 md:ml-2" />
                </Link>
                <Link
                  to="/programs"
                  className="transition duration-300 ease-in-out transform hover:scale-105 hover:text-blue-300 flex items-center"
                  aria-label="Programs"
                  id="nav-programs"
                >
                  Programs <FaClipboardList size={14} className="ml-1 md:ml-2" />
                </Link>
                <Link
                  to="/resources"
                  className="transition duration-300 ease-in-out transform hover:scale-105 hover:text-blue-300 flex items-center"
                  aria-label="Resources"
                  id="nav-resources"
                >
                  Resources <GrResources size={14} className="ml-1 md:ml-2" />
                </Link>
              </>
            )}
            {auth.loading && <LoadingSpinner />}
            {!auth.loading && !auth.user && (
              <Link
                to="/register"
                className="ml-auto border-2 border-blue-300 text-blue-300 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-500 hover:text-white"
                aria-label="Enroll Today"
                id="nav-enroll"
              >
                Enroll Today
              </Link>
            )}
            {!auth.loading && auth.user && (
              <>
                <Link
                  to="/dashboard"
                  className="transition duration-300 ease-in-out transform hover:scale-105 hover:text-blue-300 flex items-center"
                  aria-label="Dashboard"
                  id="nav-dashboard"
                >
                  Dashboard
                </Link>
                <div className="relative">
                  <NotificationHeader
                    aria-label="Notifications"
                    id="nav-notifications"
                    color="text-white"
                    onClick={toggleNotificationList} // Adding the onClick function here
                  />
                  {isNotificationListOpen && (
                    <div className="normal-case">
                      <NotificationList toggleNotificationList={toggleNotificationList} />
                    </div>
                  )}
                </div>

                <button
                  onClick={logout}
                  className="transition duration-300 ease-in-out transform hover:scale-105 hover:text-blue-300 flex items-center space-x-1 sm:space-x-2"
                  title="Logout"
                  aria-label="Logout"
                  id="nav-logout"
                >
                  <FaSignOutAlt size={18} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </nav>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && isMobile && (
          <MobileMenu toggleMobileMenu={toggleMobileMenu} logout={logout} />
        )}
      </div>
    </header>
  );
};

export default Header;
