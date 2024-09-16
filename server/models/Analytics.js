const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: [
      'signup',                       // User registration
      'login',                        // User login
      'logout',                       // User logout
      'pageview',                     // Page view (if tracking specific page visits)
      'delete_profile',               // Profile deletion
      'verification',                 // User verification after email confirmation
      'password_reset',               // Password reset action
      'one_off_payment_completed',    // One-off payment completion
      'subscription_created',         // Subscription creation
      'subscription_updated',         // Subscription update
      'subscription_canceled',        // Subscription cancellation
      'invoice_payment_succeeded',    // Invoice payment success
      'invoice_payment_failed',       // Invoice payment failure
      'payment_intent_succeeded',     // Payment intent success
      'payment_intent_failed',        // Payment intent failure
      'payment_intent_created',       // Payment intent creation
      'customer_created',             // Customer creation
      'customer_deleted',             // Customer deletion
      'charge_succeeded',             // Charge success
      'charge_updated',               // Charge updated
      'subscription_completed',       // Subscription completion
      'other'                         // Any other event types not specifically categorized
    ],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Not all events may be tied to a user (e.g., general page views)
  },
  details: {
    type: Map,
    of: String, // Additional details about the event, customizable
  },
  ip: {
    type: String, // Track the IP address associated with the event
  },
  referrer: {
    type: String, // The referring URL if available
  },
  transactionId: {
    type: String, // Store transaction ID for payment events
  },
  amount: {
    type: Number, // Store amount involved in the transaction, in cents (e.g., $10.00 = 1000)
  },
  currency: {
    type: String, // Currency of the transaction (e.g., USD, EUR)
  },
  paymentStatus: {
    type: String, // Payment status (e.g., succeeded, failed)
  },
  timestamp: {
    type: Date,
    default: Date.now, // Auto-populate with the current timestamp
  },
}, {
  timestamps: true,
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
