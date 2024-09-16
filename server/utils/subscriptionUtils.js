// server\utils\subscriptionUtils.js

const User = require('../models/User');
const { sendNotificationEmail } = require('../utils/emailUtils');

// Function to update or create user subscription in the database
async function updateUserSubscription(subscription, options = {}) {
  const { customer, status, metadata } = subscription;
  const subscriptionTier = metadata ? metadata.billing_cycle : 'default';
  const isActive = options.active || false;

  try {
    const updateData = {
      subscriptionStatus: isActive ? 'active' : status,
      subscriptionTier: subscriptionTier,
    };

    const user = await User.findOneAndUpdate(
      { stripeCustomerId: customer },
      updateData,
      { new: true, upsert: true } // Use upsert to create a new user if not exists
    );

    if (user) {
      console.log(`Subscription ${isActive ? 'activated' : 'updated'} for customer ${customer}.`);
    } else {
      console.log(`New user created with customer ID ${customer}, subscription activated.`);
    }

    return user;
  } catch (error) {
    console.error(`Error updating or creating user subscription for customer ${customer}: ${error.message}`);
    throw error;  // Re-throw the error for further handling if needed
  }
}

// Function to cancel a user's subscription in the database
async function cancelUserSubscription(subscription) {
  const { customer } = subscription;

  try {
    const user = await User.findOneAndUpdate(
      { stripeCustomerId: customer },
      { subscriptionStatus: 'canceled' },
      { new: true }
    );

    if (user) {
      console.log(`Subscription canceled for customer ${customer}.`);
    } else {
      console.log(`No user found for customer ${customer} to cancel subscription. But ensured subscription is canceled.`);
    }

    return user;
  } catch (error) {
    console.error(`Error canceling subscription for customer ${customer}: ${error.message}`);
    throw error;
  }
}

// Function to send a notification email to a user
async function sendCustomerNotification(customerId, message) {
  try {
    const user = await User.findOne({ stripeCustomerId: customerId });
    if (user) {
      await sendNotificationEmail(user.email, 'Important Subscription Update', message);
      console.log(`Notification sent to customer ${customerId} regarding: ${message}`);
    } else {
      console.log(`No user found for customer ${customerId} to send notification.`);
    }
  } catch (error) {
    console.error(`Error sending notification to customer ${customerId}: ${error.message}`);
  }
}

module.exports = {
  updateUserSubscription,
  cancelUserSubscription,
  sendCustomerNotification
};
