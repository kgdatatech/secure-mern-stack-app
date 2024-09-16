const Analytics = require('../models/Analytics');
const User = require('../models/User');

// Define all successful payment event types
const successfulPaymentEvents = [
  'one_off_payment_completed',
  'subscription_completed'
  // Remove 'invoice_payment_succeeded' if it's not necessary
];


const getAggregatedAnalytics = async (req, res) => {
  try {
    // User Statistics
    const [totalUsers, totalVerifiedUsers, totalSignups, totalLogins, totalProfileDeletions] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ isVerified: true, role: 'user' }),
      Analytics.countDocuments({ eventType: 'signup', user: { $exists: true } }),
      Analytics.countDocuments({ eventType: 'login', user: { $exists: true } }),
      Analytics.countDocuments({ eventType: 'delete_profile', user: { $exists: true } })
    ]);

// Subscriptions Overview
const [totalSubscriptions, activeSubscriptions, inactiveSubscriptions, totalOneTimePayUsers, activeOneTimePayUsers] = await Promise.all([
  // Only count users with a subscription status that is not 'inactive', including 'one-off' tier.
  User.countDocuments({ subscriptionStatus: { $ne: 'inactive' }, role: 'user' }), // Includes all but inactive subscriptions
  User.countDocuments({ subscriptionStatus: 'active', role: 'user' }), // Only active subscriptions
  User.countDocuments({ subscriptionStatus: 'inactive', role: 'user' }), // Inactive subscriptions
  User.countDocuments({ subscriptionTier: { $ne: 'monthly' }, role: 'user' }), // All users that are not in the monthly subscription tier
  User.countDocuments({ subscriptionTier: { $ne: 'monthly' }, oneOffPaymentStatus: 'completed', role: 'user' }) // Completed one-off payments that aren't in the monthly tier
]);

    // Calculate total revenue using actual payment data from Analytics
    const totalRevenueData = await Analytics.aggregate([
      {
        $match: {
          eventType: { $in: successfulPaymentEvents },
          amount: { $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }
        }
      }
    ]);

    const totalRevenue = (totalRevenueData[0]?.totalRevenue || 0) / 100; // Convert cents to dollars

    // User growth over time
    const userGrowthOverTime = await User.aggregate([
      {
        $match: { role: 'user' }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Aggregating subscriptions over time
    const subscriptionData = await User.aggregate([
      {
        $match: { role: 'user' }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          value: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Aggregating revenue over time using actual payment data
    const revenueOverTime = await Analytics.aggregate([
      {
        $match: {
          eventType: { $in: successfulPaymentEvents },
          amount: { $ne: null }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          revenue: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const revenueOverTimeFormatted = revenueOverTime.map(data => ({
      ...data,
      revenue: data.revenue / 100 // Convert cents to dollars
    }));

    res.json({
      totalUsers,
      totalSignups,
      totalLogins,
      totalProfileDeletions,
      totalVerifiedUsers,
      totalSubscriptions,
      activeSubscriptions,
      inactiveSubscriptions,
      totalOneTimePayUsers,
      activeOneTimePayUsers,
      totalRevenue,
      subscriptionData,
      revenueOverTime: revenueOverTimeFormatted,
      userGrowthOverTime,
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Function to get payment-related analytics data
const getPaymentAnalytics = async (req, res) => {
  try {
    const paymentData = await Analytics.find({
      eventType: {
        $in: [
          'payment_success',
          'payment_failure',
          'subscription_created',
          'subscription_updated',
          'subscription_canceled',
          'invoice_payment_succeeded',
          'invoice_payment_failed'
        ]
      }
    }).sort({ timestamp: -1 });

    res.status(200).json(paymentData);
  } catch (error) {
    console.error('Error fetching payment analytics data:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Function to get one-time payment analytics data
const getOneTimePayAnalytics = async (req, res) => {
  try {
    const oneTimePaymentData = await Analytics.find({
      eventType: 'one_off_payment_completed'
    }).sort({ timestamp: -1 });

    res.status(200).json(oneTimePaymentData);
  } catch (error) {
    console.error('Error fetching one-time payment analytics data:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAggregatedAnalytics,
  getPaymentAnalytics,
  getOneTimePayAnalytics,
};
