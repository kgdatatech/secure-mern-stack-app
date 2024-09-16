import { useState, useEffect } from 'react';
import { getAggregatedAnalyticsData, getPaymentAnalytics, getOneTimePaymentAnalytics } from '../services/analyticsService';

export const useAnalyticsData = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalSignups: 0,
    totalLogins: 0,
    totalProfileDeletions: 0,
    totalVerifiedUsers: 0,
    userGrowthOverTime: [],
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    inactiveSubscriptions: 0,         // Added inactiveSubscriptions
    totalOneTimePayUsers: 0,           // Added totalOneTimePayUsers
    activeOneTimePayUsers: 0,          // Added activeOneTimePayUsers
    totalRevenue: 0,
    subscriptionData: [],
    revenueData: [],
    paymentAnalytics: [],
    oneTimePaymentAnalytics: [],
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aggregatedData = await getAggregatedAnalyticsData();
        const paymentAnalytics = await getPaymentAnalytics();
        const oneTimePaymentAnalytics = await getOneTimePaymentAnalytics();
        
        setAnalytics({
          ...aggregatedData,
          paymentAnalytics,
          oneTimePaymentAnalytics,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { analytics, loading, error };
};
