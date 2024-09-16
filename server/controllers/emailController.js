const { sendNotificationEmail } = require('../utils/emailUtils');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/emailUtils');
const { generateVerificationToken } = require('../utils/tokens');

const crypto = require('crypto');

const sendVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate the verification token using the utility function
    const { token, hashedToken } = generateVerificationToken();

    // Store the hashed token in the user's document
    user.verificationToken = hashedToken;
    await user.save();

    // Send the verification email with the token
    await sendVerificationEmail(user, token);

    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// verifyEmail function (updated logic)
const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    if (!token) {
      console.error('Verification failed: No token provided');
      return res.status(400).json({ message: 'Verification token is missing. Please check your email and try again.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ verificationToken: hashedToken });

    if (!user) {
      console.error('Verification failed: Invalid or expired token');
      return res.status(400).json({ message: 'Invalid or expired verification token. Please request a new verification email.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully.' });
  } catch (error) {
    console.error('Verification failed:', error);
    res.status(500).json({ message: 'Server error during verification', error: error.message });
  }
};

// New function to send profile update notification
const sendProfileUpdateNotification = async (user) => {
  const subject = 'Your Profile Has Been Updated';
  const message = `
    Your account profile has been successfully updated. If you did not initiate this request, please contact our support team immediately.
  `;

  try {
    await sendNotificationEmail(user, subject, message);
  } catch (error) {
    console.error('Failed to send profile update notification:', error);
    throw error;
  }
};

module.exports = {
  sendVerification,
  verifyEmail,
  sendProfileUpdateNotification, // Export the new function
};
// ONLY UPDATE IF NECESSARY, OR ADDING FEATURES, WORKS