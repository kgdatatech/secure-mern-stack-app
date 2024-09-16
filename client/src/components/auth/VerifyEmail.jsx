import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyEmail } from '../../services/authService';
import { toast } from 'react-toastify';

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = new URLSearchParams(location.search).get('token');

        if (!token) {
          setError('Verification token is missing.');
          setLoading(false);
          return;
        }

        const response = await verifyEmail(token);

        if (response.message === 'Email verified successfully.') {
          toast.success(response.message);
          setTimeout(() => navigate('/dashboard'), 2000); // Redirect to dashboard after 2 seconds
        } else {
          setError('Failed to verify email. Please try again.');
        }
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Verification failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [location, navigate]);

  if (loading) {
    return <div>Verifying your email...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return null; // Since we're using toast, no need to return any JSX here
};

export default VerifyEmail;
