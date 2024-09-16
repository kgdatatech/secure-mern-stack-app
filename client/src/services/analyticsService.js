// client\src\services\analyticsService.js
import axios from '../utils/axiosInstance'; // or 'axios' if you're not using a custom axios instance

export const getAggregatedAnalyticsData = async () => {
  try {
    const response = await axios.get('/analytics/aggregated');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching analytics data');
  }
};

export const getPaymentAnalytics = async () => {
  try {
    const response = await axios.get('/analytics/payments');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment analytics:', error);
    throw error;
  }
};

export const getOneTimePaymentAnalytics = async () => {
  try {
    const response = await axios.get('/analytics/one-time-payments');
    return response.data;
  } catch (error) {
    console.error('Error fetching one-time payment analytics:', error);
    throw error;
  }
};
