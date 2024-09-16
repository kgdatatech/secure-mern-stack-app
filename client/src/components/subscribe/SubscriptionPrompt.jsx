// client\src\components\subscribe\SubscriptionPrompt.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const SubscriptionPrompt = () => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
      <p className="font-bold">Subscription Required</p>
      <p>You need to purchase a subscription to access this feature.</p>
      <Link to="/subscribe" className="text-blue-500 underline">
        Click here to subscribe
      </Link>
    </div>
  );
};

export default SubscriptionPrompt;
