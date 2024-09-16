import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const useAuthProvider = () => {
  const [auth, setAuth] = useState({ user: null, loading: true });
  const navigate = useNavigate();
  const location = useLocation();
  const hasNotified = useRef(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay

        const response = await axiosInstance.get('/auth/verify');
        const user = response.data.user;

        if (!user) {
          throw new Error('No user data');
        }

        setAuth({ user, loading: false });

        if (!hasNotified.current) {
          hasNotified.current = true;
        }

        // console.warn('useAuthProvider: Bypassing redirect to dashboard or enrollment.');
      } catch (err) {
        setAuth({ user: null, loading: false });
        // console.error('Error during auth verification:', err);

        if (!hasNotified.current) {
          hasNotified.current = true;
        }

        const publicRoutes = ['/', '/about', '/programs', '/resources', '/login', '/register', '/forgot-password', '/reset-password'];

        // Check if it's a public route
        const isPublicRoute = publicRoutes.includes(location.pathname);
        const isWildcardRoute = location.pathname === '*' || location.pathname.startsWith('/:');

        if (!isPublicRoute && !isWildcardRoute) {
          console.warn('useAuthProvider: Redirecting to login for non-public routes.');
          navigate('/login');
        } else if (isWildcardRoute) {
          console.warn('useAuthProvider: 404 route reached.');
        }
      }
    };

    verifyAuth();
  }, [navigate, location.pathname]);

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      setAuth({ user: null, loading: false });
      navigate('/login');
      toast.success('Successfully logged out');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  return { auth, setAuth, logout };
};

export default useAuthProvider;
