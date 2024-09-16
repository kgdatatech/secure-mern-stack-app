import React from 'react';
import { TfiWorld } from "react-icons/tfi";
import CmsForm from '../CmsForm'; // Adjust the path as necessary

const CmsOverviewPage = ({ setActiveTab }) => {
  return (
    <div className="flex-grow flex flex-col justify-center items-center pt-8 pb-16 dark:bg-darkBackground">
      <h1 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600 pt-6 flex items-center">
        <TfiWorld className="mr-2" /> {/* Add margin to the right of the icon */}
        Content Management System
      </h1>

      {/* Work in Progress Message */}
      <div className="w-full max-w-lg bg-orange-100 dark:bg-orange-900 border-l-4 border-orange-500 dark:border-orange-700 text-orange-700 dark:text-orange-300 p-4 mb-6" role="alert">
        <p className="font-bold">Work in Progress</p>
        <p>This page is currently under development. Some features may not be fully functional.</p>
      </div>

      {/* CmsForm Component */}
      <div className="w-full max-w-lg">
        <CmsForm />
      </div>

      {/* Footer */}
      <div className="px-8 py-4 w-full">
        <div className="mt-12 border-t border-gray-300 dark:border-gray-600 pt-2">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} Secure MERN Stack. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-black dark:hover:text-gray-200">Support</a>
              <a href="#" className="hover:text-black dark:hover:text-gray-200">Privacy</a>
              <a href="#" className="hover:text-black dark:hover:text-gray-200">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmsOverviewPage;
