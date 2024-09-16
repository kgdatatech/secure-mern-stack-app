import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Importing js-cookie
import { verify2FAToken } from '../../services/authService';
import LoadingSpinner from '../common/LoadingSpinner';

const TwoFAVerification = () => {
  const [twoFAToken, setTwoFAToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const csrfToken = Cookies.get('XSRF-TOKEN'); // Ensure CSRF token is fetched from cookies

      const response = await verify2FAToken({ token: twoFAToken, csrfToken });

      if (response && response.message === '2FA enabled successfully') {
        navigate('/dashboard');
      } else {
        setMessage('Invalid 2FA code. Please try again.');
      }
    } catch (err) {
      console.error('2FA verification error:', err);
      setMessage('2FA verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-center text-2xl font-bold mb-4">Two-Factor Authentication</h2>
        <p className="text-center text-gray-600 mb-4">Please enter your 2FA code to continue.</p>
        {message && <p className="text-center text-red-500">{message}</p>}
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="relative mb-4">
            <label htmlFor="twoFAToken" className="absolute -top-2 left-3 px-2 bg-white text-gray-500 text-sm">
              2FA Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="twoFAToken"
              name="twoFAToken"
              value={twoFAToken}
              onChange={(e) => setTwoFAToken(e.target.value)}
              required
              className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1"
              autoComplete="one-time-code"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="block w-full bg-indigo-600 text-white p-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-indigo-700 flex justify-center items-center"
          >
            {loading ? <LoadingSpinner /> : 'Verify 2FA'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TwoFAVerification;
