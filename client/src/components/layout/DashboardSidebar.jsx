// client\src\components\layout\DashboardSidebar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { GoCreditCard } from "react-icons/go";
import { FiUsers } from "react-icons/fi";
import { PiArrowCircleRightThin, PiArrowCircleLeftThin } from "react-icons/pi";
import { IoClipboardOutline, IoStatsChartSharp, IoChatbubbleEllipsesOutline, IoSettingsOutline, IoHomeOutline, IoLogOutOutline  } from "react-icons/io5";
import { RxDropdownMenu } from "react-icons/rx";
import { TfiWorld } from "react-icons/tfi";
import useDashboardData from '../../hooks/useDashboardData';
import useAuthProvider from '../../hooks/useAuthProvider';
import { useNavigate } from 'react-router-dom';

const DashboardSidebar = ({ activeTab, setActiveTab, currentUser }) => {
  const { logout } = useAuthProvider();
  const data = useDashboardData();
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setDropdownOpen(false); // Ensure the dropdown is closed on larger screens
      }
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Close the dropdown if clicked outside
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleTabClick = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      navigate(`?tab=${tab}`, { replace: true });
      setDropdownOpen(false); // Close the dropdown after navigation
    }
  };

  const menuItemStyle = {
    backgroundColor: 'var(--menu-bg)', // Dynamic background color based on theme
    color: 'var(--menu-text)', // Dynamic text color based on theme
    transition: 'background-color 0.3s ease, color 0.3s ease',
  };
  
  const menuItemHoverStyle = {
    backgroundColor: 'var(--menu-hover-bg)', // Dynamic hover background color based on theme
    color: 'var(--menu-hover-text)', // Dynamic hover text color based on theme
    transition: 'background-color 0.3s ease, color 0.3s ease',
  };
  
  const menuItemActiveStyle = {
    backgroundColor: 'var(--menu-active-bg)', // Dynamic active background color
    color: 'var(--menu-active-text)', // Dynamic active text color
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
<div className="flex h-screen">
  {isMobile && (
    <button
      onClick={toggleDropdown}
      className="fixed top-6 left-16 z-50"
      aria-label="Toggle sidebar"
    >
      <RxDropdownMenu
        size={24}
        className={`${
          activeTab === 'colored' 
            ? 'text-[var(--menu-text)]' 
            : activeTab === 'dark' 
            ? 'text-[var(--menu-text)]' 
            : 'text-[var(--menu-text)]'
        }`}
      />
    </button>
  )}

      <Sidebar
        collapsed={collapsed}
        className={`sidebar-content ${isMobile ? 'hidden' : 'block'} fixed top-16 left-0 h-[calc(100vh-64px)] transition-all duration-300 ${
          activeTab === 'colored' ? 'colored' : (activeTab === 'dark' ? 'dark' : 'light')
        }`}
        style={{
          backgroundColor: 'var(--menu-bg)', 
          color: 'var(--menu-text)', 
          transition: 'background-color 0.3s ease, color 0.3s ease',
        }}
      >
        <div className={`sidebar-content flex flex-col h-full border-r border-gray-600 ${
          activeTab === 'colored' ? 'bg-coloredBackground text-coloredText' : (activeTab === 'dark' ? 'dark:bg-darkBackground dark:text-darkText' : '')
        }`}>
          {/* Header Section */}
          <div className={`flex items-center justify-${collapsed ? 'center' : 'between'} px-4 py-2 border-b border-gray-600 ${
            activeTab === 'colored' ? 'bg-coloredBackground text-coloredText' : ''
          }`}>
            {!collapsed && (
              <div>
                <h2 className={`text-lg ${activeTab === 'colored' ? 'text-coloredText' : 'dark:text-white'}`}>
                  Dashboard
                </h2>
                <p className={`text-sm ${activeTab === 'colored' ? 'text-coloredText' : 'dark:text-gray-500'}`}>
                  <b>{data.name}</b>
                </p>
                <p className={`text-sm italic ${activeTab === 'colored' ? 'text-lime-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {data.role} account
                </p>
              </div>
            )}
            {!isMobile && (
              <button onClick={toggleSidebar} className={`${activeTab === 'colored' ? 'text-coloredText' : 'dark:text-white'}`}>
                {collapsed ? <PiArrowCircleRightThin size={24} /> : <PiArrowCircleLeftThin size={24} />}
              </button>
            )}
          </div>

          {/* Menu Items */}
          <div className={`sidebar-content flex-grow overflow-y-auto ${
            activeTab === 'colored' ? 'bg-coloredCard text-coloredText' : 'dark:bg-darkCard'
          }`}>
          <Menu iconShape="circle" className="space-y-2">
            <MenuItem
              active={activeTab === 'dashboard'}
              onClick={() => handleTabClick('dashboard')}
              icon={<IoHomeOutline className={activeTab === 'dashboard' ? 'text-[var(--menu-active-text)]' : 'text-[var(--menu-text)]'} />}
              className={`sidebar-item ${activeTab === 'dashboard' ? 'sidebar-item-active' : ''}`}
              style={activeTab === 'dashboard' ? menuItemActiveStyle : menuItemStyle}
            >
              {!collapsed && <span>Overview</span>}
            </MenuItem>

              {data.role === 'admin' && (
                <>
                  <MenuItem
                    active={activeTab === 'analytics'}
                    onClick={() => handleTabClick('analytics')}
                    icon={<IoStatsChartSharp className={activeTab === 'analytics' ? 'text-[var(--menu-active-text)]' : 'text-[var(--menu-text)]'} />}
                    className={`sidebar-item ${activeTab === 'analytics' ? 'sidebar-item-active' : ''}`}
                    style={activeTab === 'analytics' ? menuItemActiveStyle : menuItemStyle}
                  >
                    {!collapsed && <span>Reports</span>}
                  </MenuItem>

                  <MenuItem
                    active={activeTab === 'users'}
                    onClick={() => handleTabClick('users')}
                    icon={<FiUsers className={activeTab === 'users' ? 'text-[var(--menu-active-text)]' : 'text-[var(--menu-text)]'} />}
                    className={`sidebar-item ${activeTab === 'users' ? 'sidebar-item-active' : ''}`}
                    style={activeTab === 'users' ? menuItemActiveStyle : menuItemStyle}
                  >
                    {!collapsed && <span>Users</span>}
                  </MenuItem>

                  <MenuItem
                    active={activeTab === 'adminPrograms'}
                    onClick={() => handleTabClick('adminPrograms')}
                    icon={<IoClipboardOutline className={activeTab === 'adminPrograms' ? 'text-[var(--menu-active-text)]' : 'text-[var(--menu-text)]'} />}
                    className={`sidebar-item ${activeTab === 'adminPrograms' ? 'sidebar-item-active' : ''}`}
                    style={activeTab === 'adminPrograms' ? menuItemActiveStyle : menuItemStyle}
                  >
                    {!collapsed && <span>Programs</span>}
                  </MenuItem>

                  <MenuItem
                    active={activeTab === 'updateContent'}
                    onClick={() => handleTabClick('updateContent')}
                    icon={<TfiWorld className={activeTab === 'updateContent' ? 'text-[var(--menu-active-text)]' : 'text-[var(--menu-text)]'} />}
                    className={`sidebar-item ${activeTab === 'updateContent' ? 'sidebar-item-active' : ''}`}
                    style={activeTab === 'updateContent' ? menuItemActiveStyle : menuItemStyle}
                  >
                    {!collapsed && <span>System Settings</span>}
                  </MenuItem>
                </>
              )}

              {data.role !== 'admin' && (
                <>
                  <MenuItem
                    active={activeTab === 'userPrograms'}
                    onClick={() => handleTabClick('userPrograms')}
                    icon={<IoClipboardOutline className={activeTab === 'userPrograms' ? 'text-[var(--menu-active-text)]' : 'text-[var(--menu-text)]'} />}
                    className={`sidebar-item ${activeTab === 'userPrograms' ? 'sidebar-item-active' : ''}`}
                    style={activeTab === 'userPrograms' ? menuItemActiveStyle : menuItemStyle}
                  >
                    {!collapsed && <span>User Programs</span>}
                  </MenuItem>

                  <MenuItem
                    active={activeTab === 'billing'}
                    onClick={() => handleTabClick('billing')}
                    icon={<GoCreditCard className={activeTab === 'billing' ? 'text-[var(--menu-active-text)]' : 'text-[var(--menu-text)]'} />}
                    className={`sidebar-item ${activeTab === 'billing' ? 'sidebar-item-active' : ''}`}
                    style={activeTab === 'billing' ? menuItemActiveStyle : menuItemStyle}
                  >
                    {!collapsed && <span>Billing</span>}
                  </MenuItem>
                </>
              )}

              <MenuItem
                active={activeTab === 'messages'}
                onClick={() => handleTabClick('messages')}
                icon={<IoChatbubbleEllipsesOutline className={activeTab === 'messages' ? 'text-[var(--menu-active-text)]' : 'text-[var(--menu-text)]'} />}
                className={`sidebar-item ${activeTab === 'messages' ? 'sidebar-item-active' : ''}`}
                style={activeTab === 'messages' ? menuItemActiveStyle : menuItemStyle}
              >
                {!collapsed && <span>Inbox</span>}
              </MenuItem>

              <MenuItem
                active={activeTab === 'settings'}
                onClick={() => handleTabClick('settings')}
                icon={<IoSettingsOutline className={activeTab === 'settings' ? 'text-[var(--menu-active-text)]' : 'text-[var(--menu-text)]'} />}
                className={`sidebar-item ${activeTab === 'settings' ? 'sidebar-item-active' : ''}`}
                style={activeTab === 'settings' ? menuItemActiveStyle : menuItemStyle}
              >
                {!collapsed && <span>Account</span>}
              </MenuItem>
            </Menu>
          </div>

          {/* Footer Section */}
          <div className={`sidebar-footer p-4 border-t border-gray-600 ${
            activeTab === 'colored' ? 'bg-coloredBackground text-coloredText' : ''
          } flex justify-center`}>
            <button
              onClick={logout}
              className={`flex items-center justify-center w-full py-3 bg-transparent rounded-lg hover:bg-lime-600 dark:hover:bg-indigo-950 transition-all duration-200 ${
                activeTab === 'colored' ? 'text-coloredText' : 'dark:text-white'
              }`}
            >
              <IoLogOutOutline className={`mr-2 ${activeTab === 'colored' ? 'text-coloredText' : 'dark:text-white'}`} />
              {!collapsed && 'Logout'}
            </button>
          </div>
        </div>
      </Sidebar>
      
      {isMobile && dropdownOpen && (
        <div ref={dropdownRef} className="absolute top-16 left-6 z-50 w-3/4 sm:w-1/2 bg-[#191919] text-white shadow-lg border border-gray-600">
          <Menu iconShape="circle" className="space-y-2 p-4">
            <MenuItem
              active={activeTab === 'dashboard'}
              onClick={() => handleTabClick('dashboard')}
              icon={<IoHomeOutline className={activeTab === 'dashboard' ? 'text-white' : 'text-gray-400 dark:text-gray-300'} />}
              className={activeTab === 'dashboard' ? 'sidebar-item-active' : ''}
              style={activeTab === 'dashboard' ? menuItemActiveStyle : menuItemStyle}
            >
              Overview
            </MenuItem>

            {data.role === 'admin' && (
              <>
                <MenuItem
                  active={activeTab === 'analytics'}
                  onClick={() => handleTabClick('analytics')}
                  icon={<IoStatsChartSharp className={activeTab === 'analytics' ? 'text-white' : 'text-gray-400 dark:text-gray-300'} />}
                  className={activeTab === 'analytics' ? 'sidebar-item-active' : ''}
                  style={activeTab === 'analytics' ? menuItemActiveStyle : menuItemStyle}
                >
                  Reports
                </MenuItem>

                <MenuItem
                  active={activeTab === 'users'}
                  onClick={() => handleTabClick('users')}
                  icon={<FiUsers className={activeTab === 'users' ? 'text-white' : 'text-gray-400 dark:text-gray-300'} />}
                  className={activeTab === 'users' ? 'sidebar-item-active' : ''}
                  style={activeTab === 'users' ? menuItemActiveStyle : menuItemStyle}
                >
                  Users
                </MenuItem>

                <MenuItem
                  active={activeTab === 'adminPrograms'}
                  onClick={() => handleTabClick('adminPrograms')}
                  icon={<IoClipboardOutline className={activeTab === 'adminPrograms' ? 'text-white' : 'text-gray-400 dark:text-gray-300'} />}
                  className={activeTab === 'adminPrograms' ? 'sidebar-item-active' : ''}
                  style={activeTab === 'adminPrograms' ? menuItemActiveStyle : menuItemStyle}
                >
                  Programs
                </MenuItem>

                <MenuItem
                  active={activeTab === 'updateContent'}
                  onClick={() => handleTabClick('updateContent')}
                  icon={<TfiWorld className={activeTab === 'updateContent' ? 'text-white' : 'text-gray-400 dark:text-gray-300'} />}
                  className={activeTab === 'updateContent' ? 'sidebar-item-active' : ''}
                  style={activeTab === 'updateContent' ? menuItemActiveStyle : menuItemStyle}
                >
                  System Settings
                </MenuItem>
              </>
            )}

            {data.role !== 'admin' && (
              <>
                <MenuItem
                  active={activeTab === 'billing'}
                  onClick={() => handleTabClick('billing')}
                  icon={<GoCreditCard className={activeTab === 'billing' ? 'text-white' : 'text-gray-400 dark:text-gray-300'} />}
                  className={activeTab === 'billing' ? 'sidebar-item-active' : ''}
                  style={activeTab === 'billing' ? menuItemActiveStyle : menuItemStyle}
                >
                  Billing
                </MenuItem>

                <MenuItem
                  active={activeTab === 'userPrograms'}
                  onClick={() => handleTabClick('userPrograms')}
                  icon={<IoClipboardOutline className={activeTab === 'userPrograms' ? 'text-white' : 'text-gray-400 dark:text-gray-300'} />}
                  className={activeTab === 'userPrograms' ? 'sidebar-item-active' : ''}
                  style={activeTab === 'userPrograms' ? menuItemActiveStyle : menuItemStyle}
                >
                  My Programs
                </MenuItem>
              </>
            )}

            <MenuItem
              active={activeTab === 'messages'}
              onClick={() => handleTabClick('messages')}
              icon={<IoChatbubbleEllipsesOutline className={activeTab === 'messages' ? 'text-white' : 'text-gray-400 dark:text-gray-300'} />}
              className={activeTab === 'messages' ? 'sidebar-item-active' : ''}
              style={activeTab === 'messages' ? menuItemActiveStyle : menuItemStyle}
            >
              Inbox
            </MenuItem>

            <MenuItem
              active={activeTab === 'settings'}
              onClick={() => handleTabClick('settings')}
              icon={<IoSettingsOutline className={activeTab === 'settings' ? 'text-white' : 'text-gray-400 dark:text-gray-300'} />}
              className={activeTab === 'settings' ? 'sidebar-item-active' : ''}
              style={activeTab === 'settings' ? menuItemActiveStyle : menuItemStyle}
            >
              Account
            </MenuItem>

            <MenuItem
              onClick={logout}
              icon={<IoLogOutOutline className="text-gray-400 dark:text-gray-300 hover:text-white" />}
              style={menuItemStyle}
            >
              Logout
            </MenuItem>
          </Menu>
        </div>
      )}
    </div>
  );
};

export default DashboardSidebar;
