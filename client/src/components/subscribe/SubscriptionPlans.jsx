import React, { useState } from 'react';
import axios from 'axios';
import soccerImage from '../../assets/1.jpg';
import useAuthProvider from '../../hooks/useAuthProvider';
import { deleteUserProfile } from '../../services/userService'; // Import deleteUserProfile

const SubscriptionPlans = () => {
  const { auth, setAuth } = useAuthProvider();
  const [billingCycle, setBillingCycle] = useState('one-off');
  const [loading, setLoading] = useState(false);

  const handleBillingCycleChange = (cycle) => {
    setBillingCycle(cycle);
  };

  const handleSubscribe = async () => {
    if (!auth.user) {
      alert('Please log in or register before subscribing.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/subscription/create', { // ISSUE FOUND
        userId: auth.user._id,
        priceId: billingCycle === 'one-off' ? 'price_ID' : 'price_ID2',
      });

      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('An error occurred while creating your subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!auth.user) return;

    const confirmDelete = window.confirm('Are you sure you want to cancel your subscription and delete your account? This action cannot be undone.');

    if (confirmDelete) {
      try {
        await deleteUserProfile();
        alert('Your account has been successfully deleted.');
        setAuth(null); // Clear the auth context
        window.location.href = '/'; // Redirect to the homepage or another page
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('An error occurred while deleting your account. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-gray-50 to-slate-200 p-2"
         style={{ minHeight: 'calc(100vh - 4rem)', paddingTop: '4rem' }}> {/* Adjusting for the header size */}
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Select Your Subscription Plan</h2>
      <div className="flex justify-center mb-3">
        <button 
          onClick={() => handleBillingCycleChange('one-off')} 
          className={`px-2 py-1 rounded-l-full font-semibold text-sm focus:outline-none ${billingCycle === 'one-off' ? 'bg-lime-600 text-white' : 'bg-gray-200 text-gray-800'} transition duration-300 ease-in-out`}>
          One-off
        </button>
        <button 
          onClick={() => handleBillingCycleChange('monthly')} 
          className={`px-2 py-1 rounded-r-full font-semibold text-sm focus:outline-none ${billingCycle === 'monthly' ? 'bg-lime-600 text-white' : 'bg-gray-200 text-gray-800'} transition duration-300 ease-in-out`}>
          Monthly
        </button>
      </div>

      <div className="flex justify-center items-center w-full">
        <div className="bg-white border border-gray-200 p-3 max-w-xs w-full shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out text-center">
          <img src={soccerImage} alt="Secure MERN Stack" className="w-full h-32 object-cover mb-3" />
          <h3 className="text-lg font-bold mb-1 text-gray-800">Secure MERN Stack</h3>
          <p className="text-xs text-gray-600 mb-2">Get access to all Secure MERN Stack Program features and support.</p>
          <p className="text-2xl font-extrabold mb-3 text-gray-800">
            {billingCycle === 'one-off' ? '$45' : '$180'} <span className="text-sm font-medium">/{billingCycle}</span>
          </p>
          <button 
            onClick={handleSubscribe} 
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out text-sm font-bold"
            disabled={loading}>
            {loading ? 'Processing...' : 'Enroll & Subscribe'}
          </button>
        </div>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={handleCancelSubscription}
          className="text-xs text-red-600 hover:underline"
        >
          Cancel subscription and delete my account
        </button>
      </div>

      <div className="px-2 py-2">
        <div className="mt-8 border-t border-gray-300 pt-2">
          <div className="flex justify-between text-xs text-gray-600">
            <p>&copy; {new Date().getFullYear()} Secure MERN Stack. All rights reserved.</p>
            <div className="flex space-x-2">
              <a href="#" className="hover:text-black">Support</a>
              <a href="#" className="hover:text-black">Privacy Policy</a>
              <a href="#" className="hover:text-black">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
