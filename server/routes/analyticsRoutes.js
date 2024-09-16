const express = require('express');
const { 
  getAggregatedAnalytics, 
  getPaymentAnalytics, 
  getOneTimePayAnalytics 
} = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/authMiddleware'); // Ensure only authorized users access the analytics

const router = express.Router();

// Route to get aggregated analytics data
router.get('/aggregated', authMiddleware.protect, getAggregatedAnalytics);

// Route to get subscription payment analytics data
router.get('/payments', authMiddleware.protect, getPaymentAnalytics);

// Route to get one-off payment analytics data
router.get('/one-time-payments', authMiddleware.protect, getOneTimePayAnalytics);

module.exports = router;
