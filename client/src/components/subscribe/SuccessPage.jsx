// client\src\components\subscribe\SuccessPage.jsx

import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const SuccessPage = ({ sessionData }) => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-xl w-full text-center">
        <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4">Thank You for Your Subscription!</h2>
        <p className="text-gray-600 mb-6">
          Your subscription was successful. A confirmation has been sent to your email.
        </p>
        {sessionData && (
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-gray-700">
              <span className="font-semibold">Subscription ID:</span> {sessionData.id}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Amount Paid:</span> ${sessionData.amount_total / 100}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Subscription Plan:</span> {sessionData.plan.nickname}
            </p>
          </div>
        )}
        <button
          onClick={handleGoToDashboard}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300 ease-in-out transform hover:scale-105"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
