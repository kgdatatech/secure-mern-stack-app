const User = require('../models/User');
const { sendResetPasswordEmail } = require('../utils/emailUtils');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Helper function to generate and hash reset token
const generateResetPasswordToken = async () => {
  const resetToken = crypto.randomBytes(32).toString('hex'); // Generate token
  const hashedToken = await bcrypt.hash(resetToken, 10); // Hash token before storing
  return { resetToken, hashedToken };
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Generate and hash token
  const { resetToken, hashedToken } = await generateResetPasswordToken();
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now

  await user.save();

  // Send email with the plain token
  await sendResetPasswordEmail(user, resetToken);

  res.status(200).json({ message: 'Password reset email sent' });
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({
    resetPasswordExpires: { $gt: Date.now() } // Ensure token is not expired
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  // Compare provided token with stored hashed token
  const isMatch = await bcrypt.compare(token, user.resetPasswordToken);
  if (!isMatch) return res.status(400).json({ message: 'Invalid or expired token' });

  // Hash the new password before saving it
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successful. Please log in with your new password.' });
};


module.exports = {
  requestPasswordReset,
  resetPassword
};
