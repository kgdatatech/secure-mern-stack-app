import React from 'react';
import { motion } from 'framer-motion';
import { FaCreditCard } from 'react-icons/fa';

function Billing() {
  const handleBillingClick = () => {
    window.location.href = 'https://billing.stripe.com/p/login/test_5kA7vJ4WLafpeTmfYY';
  };

   return (
    <div className="flex flex-col items-center justify-start bg-white dark:bg-darkBackground p-6 overflow-hidden">
      <motion.div
        className="bg-white dark:bg-darkCard shadow-md rounded-lg p-8 max-w-lg w-full text-center mt-16"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-lg sm:text-2xl font-bold mb-4 w-full sm:mb-0 text-gray-800 dark:text-darkText border-b border-gray-300 dark:border-darkCard flex items-center justify-center">
          <FaCreditCard className="mr-2" />
          Manage Your Billing
        </h2>

        <p className="text-gray-600 dark:text-darkText mt-2 mb-8">
          Please visit your customer portal below to manage your subscription, view billing history, and update your payment methods.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBillingClick}
          className="bg-indigo-600 dark:bg-indigo-800 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 dark:hover:bg-indigo-900 transition duration-300 ease-in-out"
        >
          Go to Billing Portal
        </motion.button>
      </motion.div>

      {/* Footer */}
      <div className="px-8 py-4">
        <div className="mt-12 border-t border-gray-300 dark:border-darkCard pt-2">
          <div className="flex justify-between text-xs text-gray-600 dark:text-darkText">
            <p>&copy; {new Date().getFullYear()} Secure MERN Stack. All rights reserved.</p>
            <div className="mx-6 flex space-x-2">
              <a href="#" className="hover:text-black dark:hover:text-white">Support</a>
              <a href="#" className="hover:text-black dark:hover:text-white">Privacy</a>
              <a href="#" className="hover:text-black dark:hover:text-white">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Billing;