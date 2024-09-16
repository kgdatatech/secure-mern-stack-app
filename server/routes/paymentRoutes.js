//server\routes\paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createPaymentIntent } = require('../controllers/paymentController');

// Route to create a new one-off payment
router.post('/create-payment-intent', createPaymentIntent);

module.exports = router;
