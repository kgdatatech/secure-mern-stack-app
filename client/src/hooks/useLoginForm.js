//client\src\hooks\useLoginForm.js
import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Cookies from 'js-cookie';
import { sendVerificationEmail } from '../services/authService';
import { toast } from 'react-toastify';
import { useNotificationList } from '../hooks/useNotificationList'; // Correct import

const useLoginForm = (setAuth, navigate) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const isCaptchaEnabled = import.meta.env.VITE_APP_ENABLE_CAPTCHA === 'true';

  const { fetchNotifications } = useNotificationList(setNotifications, setUnreadCount); // Correct usage

  const handleLogin = async (csrfToken, captchaToken, onSuccess) => {
    setLoading(true);
  
    // Clear previous session tokens
    Cookies.remove('jwt');
    Cookies.remove('refreshToken');
  
    try {
      const requestData = { email, password };
      if (isCaptchaEnabled) {
        requestData.captchaToken = captchaToken;
      }
  
      const response = await axiosInstance.post('/auth/login', requestData, {
        headers: { 'X-CSRF-Token': csrfToken },
      });
  
      if (response.status === 206) {
        navigate('/2fa'); // Redirect to the 2FA verification page
        return;
      }
  
      if (!response.data || !response.data.user) {
        throw new Error('Login failed: No user data returned from the server.');
      }
  
      const user = response.data.user;
  
      if (!user.isVerified) {
        await sendVerificationEmail();
        toast.success('Please verify your email. A new verification email has been sent.');
      } else {
        toast.success('Login successful! Redirecting to your dashboard.');
      }
  
      setAuth({ user, loading: false });
  
      await fetchNotifications();  // Fetch notifications after login
  
      // Redirect all users to the dashboard after successful login
      navigate('/dashboard');
  
      onSuccess?.();
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    loading, setLoading,
    handleLogin,
  };
};

export default useLoginForm;
