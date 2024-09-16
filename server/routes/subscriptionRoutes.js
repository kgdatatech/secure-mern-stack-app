const express = require('express');
const router = express.Router();
const { createSubscription } = require('../controllers/paymentController');
const { getUsersSubscriptionStatus } = require('../controllers/userController');

// Route to create a new subscription
router.post('/create', createSubscription);

// Route to get users' subscription statuses
router.get('/status', getUsersSubscriptionStatus);

module.exports = router;
