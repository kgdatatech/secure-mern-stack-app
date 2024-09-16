import React from 'react';
import { FaHome, FaUser, FaUsers, FaUserShield, FaCog, FaChartLine, FaEnvelope, FaClipboardList, FaCreditCard, FaWrench } from 'react-icons/fa';
import { PiHandWaving } from "react-icons/pi";
import { motion } from 'framer-motion';
import useUserStatus from '../../hooks/useUserStatus';
import StatusIndicator from './StatusIndicator';

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const WelcomeDashboard = ({ name, role, theme }) => {
  const { status, loading } = useUserStatus();

  const greenIndicators = [
    { label: "account status", isActive: status.isVerified },
    { label: "active programs", isActive: status.hasActiveProgram }
  ];

  const redIndicator = { label: "active one-time program", isActive: status.hasActiveOneTimePayment };
  const showRedIndicator = !(greenIndicators.filter(indicator => indicator.isActive).length === 2);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-darkBackground p-10 pb-24">
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <PiHandWaving className="mr-2" />
        Welcome back, {name}!
      </motion.h2>

      <motion.p
        className="text-md text-gray-600 dark:text-gray-300 mb-4 w-full sm:mb-4 border-b border-gray-300 dark:border-gray-700 flex items-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {role === 'admin' ? (
          <FaUserShield className="mr-2 text-gray-500 dark:text-gray-400" />
        ) : (
          <FaUser className="mr-2 text-gray-500 dark:text-gray-400" />
        )}
        You are logged in as {role === 'admin' ? 'Administrator' : 'User'}.
      </motion.p>

      <motion.div className="flex justify-end mb-10 space-x-4">
        {!loading && (
          <>
            {greenIndicators.map((indicator, index) => (
              <StatusIndicator key={index} label={indicator.label} isActive={indicator.isActive} />
            ))}
            {showRedIndicator && (
              <StatusIndicator label={redIndicator.label} isActive={redIndicator.isActive} />
            )}
          </>
        )}
      </motion.div>

      <motion.p
        className="text-md text-gray-500 dark:text-gray-300 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        Explore your dashboard to manage {role === 'admin' ? 'the system' : 'your account and activities'} effectively.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <a href="https://localhost:5173/dashboard?tab=dashboard">
          <motion.div
            className="bg-white dark:bg-darkCard dark:text-gray-100 rounded-lg shadow-md p-6 text-center"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <FaHome className="text-blue-500 dark:text-blue-400 text-4xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Home</h3>
            <p className="text-gray-600 dark:text-gray-300">View your homepage overview and quick links.</p>
          </motion.div>
        </a>

        {role === 'admin' && (
          <>
            <a href="https://localhost:5173/dashboard?tab=analytics">
              <motion.div
                className="bg-white dark:bg-darkCard dark:text-gray-100 rounded-lg shadow-md p-6 text-center"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <FaChartLine className="text-red-500 dark:text-red-400 text-4xl mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Reports</h3>
                <p className="text-gray-600 dark:text-gray-300">View system reports and analytics.</p>
              </motion.div>
            </a>

            <a href="https://localhost:5173/dashboard?tab=userManagement">
              <motion.div
                className="bg-white dark:bg-darkCard dark:text-gray-100 rounded-lg shadow-md p-6 text-center"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <FaUsers className="text-purple-500 dark:text-purple-400 text-4xl mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">User Management</h3>
                <p className="text-gray-600 dark:text-gray-300">Manage users and permissions.</p>
              </motion.div>
            </a>

            <a href="https://localhost:5173/dashboard?tab=programs">
              <motion.div
                className="bg-white dark:bg-darkCard dark:text-gray-100 rounded-lg shadow-md p-6 text-center"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <FaClipboardList className="text-orange-500 dark:text-orange-400 text-4xl mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Create Programs</h3>
                <p className="text-gray-600 dark:text-gray-300">Manage and overview all your programs.</p>
              </motion.div>
            </a>

            <a href="https://localhost:5173/dashboard?tab=updateContent">
              <motion.div
                className="bg-white dark:bg-darkCard dark:text-gray-100 rounded-lg shadow-md p-6 text-center"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <FaWrench className="text-indigo-500 dark:text-indigo-400 text-4xl mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Content Management System</h3>
                <p className="text-gray-600 dark:text-gray-300">Manage and update your website's content with ease.</p>
              </motion.div>
            </a>
          </>
        )}

        {role !== 'admin' && (
          <>
            <a href="https://localhost:5173/dashboard?tab=userPrograms">
              <motion.div
                className="bg-white dark:bg-darkCard dark:text-gray-100 rounded-lg shadow-md p-6 text-center"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <FaClipboardList className="text-orange-500 dark:text-orange-400 text-4xl mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">User Programs</h3>
                <p className="text-gray-600 dark:text-gray-300">Manage and overview all your programs.</p>
              </motion.div>
            </a>

            <a href="https://localhost:5173/dashboard?tab=billing">
              <motion.div
                className="bg-white dark:bg-darkCard dark:text-gray-100 rounded-lg shadow-md p-6 text-center"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <FaCreditCard className="text-red-500 dark:text-red-400 text-4xl mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Billing Overview</h3>
                <p className="text-gray-600 dark:text-gray-300">View and manage your billing information.</p>
              </motion.div>
            </a>
          </>
        )}

        <a href="https://localhost:5173/dashboard?tab=messages">
          <motion.div
            className="bg-white dark:bg-darkCard dark:text-gray-100 rounded-lg shadow-md p-6 text-center"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <FaEnvelope className="text-purple-500 dark:text-purple-400 text-4xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Messages</h3>
            <p className="text-gray-600 dark:text-gray-300">Check your latest messages and alerts.</p>
          </motion.div>
        </a>

        <a href="https://localhost:5173/dashboard?tab=settings">
          <motion.div
            className="bg-white dark:bg-darkCard dark:text-gray-100 rounded-lg shadow-md p-6 text-center"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="flex justify-center items-center space-x-2 mb-4">
              <FaUser className="text-green-500 dark:text-green-400 text-4xl" />
              <FaCog className="text-green-500 dark:text-green-400 text-4xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Settings</h3>
            <p className="text-gray-600 dark:text-gray-300">Manage your profile and system settings.</p>
          </motion.div>
        </a>
      </div>

      <div className="px-0 py-4">
        <div className="mt-12 border-t border-gray-300 dark:border-gray-700 pt-2">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} Secure MERN Stack. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-black dark:hover:text-gray-300">Support</a>
              <a href="#" className="hover:text-black dark:hover:text-gray-300">Privacy</a>
              <a href="#" className="hover:text-black dark:hover:text-gray-300">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
