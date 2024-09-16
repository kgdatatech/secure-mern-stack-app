import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const useDashboardData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/auth/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return data;
};

export default useDashboardData;
