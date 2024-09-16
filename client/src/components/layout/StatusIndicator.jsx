import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StatusIndicator = ({ label, isActive }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getMessage = () => {
    switch (label) {
      case 'account status':
        return isActive ? 'Your account is verified.' : 'Your account is not verified.';
      case 'active programs':
        return isActive ? 'You have an active subscription.' : 'You do not have any active subscriptions.';
      case 'active one-time program':
        return isActive ? 'You have completed a one-time payment.' : 'You have not completed a one-time payment.';
      default:
        return '';
    }
  };

  return (
    <div className="relative flex items-center space-x-2">
      {/* Status Dot */}
      <motion.div
        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full cursor-pointer 
          ${isActive ? 'bg-green-400' : 'bg-red-400'}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        animate={{
          scale: isActive ? [1, 1.1, 1] : [1, 1.05, 1],
          boxShadow: isActive
            ? '0 0 4px 1px rgba(34,197,94,0.4)' // Green glow for active
            : '0 0 4px 1px rgba(239,68,68,0.4)', // Red glow for inactive
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'mirror',
        }}
      ></motion.div>

      {/* Status Label */}
      <span
        className={`text-xs sm:text-xs cursor-pointer ${
          isActive ? 'text-gray-800 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
        }`}  // Manually apply the text styling to all indicators
      >
        {label}
      </span>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute bottom-full mb-1 px-3 py-1 text-xs rounded shadow-lg text-white bg-gray-800 dark:bg-gray-800"
          >
            {getMessage()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatusIndicator;
