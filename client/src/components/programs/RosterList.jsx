import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEnvelope } from 'react-icons/fa';

const RosterList = ({ programId }) => {
  const [programDetails, setProgramDetails] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/subscription/status');
        const active = response.data.filter(user => user.subscriptionStatus === 'active' && user.programId === programId);
        const inactive = response.data.filter(user => user.subscriptionStatus !== 'active' && user.programId === programId);
        setActiveUsers(active);
        setInactiveUsers(inactive);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load roster data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [programId]);

  const handleSendNewsletter = async () => {
    const emails = [...activeUsers, ...inactiveUsers].map(user => user.email);
    
    setSending(true);
    
    try {
      await axios.post('/api/send-bulk-newsletter', {
        emails,
        subject: newsletterSubject,
        message: newsletterMessage,
      });
      alert('Newsletter sent successfully!');
    } catch (error) {
      console.error('Error sending newsletter:', error);
      alert('Failed to send the newsletter.');
    } finally {
      setSending(false);
    }
  };    

  if (loading) {
    return <p>Loading program and roster details...</p>;
  }

  if (error) {
    return <p className="text-red-500 dark:text-red-400">{error}</p>;
  }
  
  return (
    <div className="p-4 bg-white dark:bg-darkCard shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Program Roster</h2>
  
      <div className="mb-4">
        <h3 className="text-lg font-medium text-green-700 dark:text-green-500 mb-2">Active Users</h3>
        <ul className="space-y-2">
          {activeUsers.map(user => (
            <li key={user.email} className="flex justify-between items-center bg-green-50 dark:bg-green-900 p-2 rounded-lg shadow-sm">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {user.username} <span className="text-gray-600 dark:text-gray-400">({user.email})</span>
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Verified: {user.isVerified ? 'Yes' : 'No'}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Subscription Tier: {user.subscriptionTier}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Active Program: {user.hasActiveProgram ? 'Yes' : 'No'}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">One-Time Payment: {user.hasActiveOneTimePayment ? 'Completed' : 'Pending'}</span>
              </div>
              <FaEnvelope
                className="text-gray-500 dark:text-gray-400 cursor-pointer"
                onClick={() => handleEmailClick(user.email)}
              />
            </li>
          ))}
        </ul>
      </div>
  
      <div className="mb-4">
        <h3 className="text-lg font-medium text-red-700 dark:text-red-500 mb-2">Inactive Users</h3>
        <ul className="space-y-2">
          {inactiveUsers.map(user => (
            <li key={user.email} className="flex justify-between items-center bg-red-50 dark:bg-red-900 p-2 rounded-lg shadow-sm">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {user.username} <span className="text-gray-600 dark:text-gray-400">({user.email})</span>
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Verified: {user.isVerified ? 'Yes' : 'No'}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Subscription Tier: {user.subscriptionTier}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Active Program: {user.hasActiveProgram ? 'Yes' : 'No'}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">One-Time Payment: {user.hasActiveOneTimePayment ? 'Completed' : 'Pending'}</span>
              </div>
              <FaEnvelope
                className="text-gray-500 dark:text-gray-400 cursor-pointer"
                onClick={() => handleEmailClick(user.email)}
              />
            </li>
          ))}
        </ul>
      </div>
  
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Send Bulk Newsletter</h3>
        <input
          type="text"
          value={newsletterSubject}
          onChange={(e) => setNewsletterSubject(e.target.value)}
          placeholder="Subject"
          className="w-full px-4 py-2 mb-3 border dark:border-gray-700 dark:bg-darkInput dark:text-gray-100 rounded-md"
        />
        <textarea
          value={newsletterMessage}
          onChange={(e) => setNewsletterMessage(e.target.value)}
          placeholder="Message"
          className="w-full px-4 py-2 mb-3 border dark:border-gray-700 dark:bg-darkInput dark:text-gray-100 rounded-md"
          rows="4"
        />
        <button
          onClick={handleSendNewsletter}
          disabled={sending}
          className={`w-full bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded ${sending ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-600 dark:hover:bg-gray-700'}`}
        >
          {sending ? 'Sending...' : 'Send Newsletter'}
        </button>
      </div>
    </div>
  );  
};

export default RosterList;
