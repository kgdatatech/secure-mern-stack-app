import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const useCsrfToken = () => {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axiosInstance.get('/csrf-token');
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        console.error('Error fetching CSRF token:', err);
      }
    };

    fetchCsrfToken();
  }, []);

  return csrfToken;
};

export default useCsrfToken;
