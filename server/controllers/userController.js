const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { generateAccessToken } = require('../middlewares/authMiddleware');
const { sendProfileUpdateNotification } = require('../controllers/emailController'); // Import the function


// Confirm password reset
const confirmPasswordReset = async (req, res) => {
  const { password, token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.PASSWORD_RESET_TOKEN_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Invalid or expired token', error: error.message });
  }
};

// Confirm email verification
const confirmEmailVerification = async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_TOKEN_SECRET);

    // Find the user based on the decoded token
    const user = await User.findById(decoded.userId); // Ensure the token was generated with userId

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Mark the user as verified and save
    user.isVerified = true;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Verification token has expired. Please request a new one.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid verification token.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user details (admin)
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, username, password, role, twoFactorEnabled, avatar } = req.body;

  try {
    const updateData = { name, email, username, twoFactorEnabled, avatar };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    if (role) {
      updateData.role = role;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Update user's own profile
const updateUserProfile = async (req, res) => {
  const { name, email, username, password, avatar, twoFactorEnabled } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.username = username || user.username;
      user.avatar = avatar || user.avatar;

      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      // Update 2FA enabled status if it is provided
      if (typeof twoFactorEnabled === 'boolean') {
        user.twoFactorEnabled = twoFactorEnabled;

        // If disabling 2FA, clear the secret
        if (!twoFactorEnabled) {
          user.twoFactorSecret = undefined;
        }
      }

      const updatedUser = await user.save();

      // Send notification email after profile update
      await sendProfileUpdateNotification(user);

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        twoFactorEnabled: updatedUser.twoFactorEnabled,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteUserProfile = async (req, res) => {
  try {
    // Find the user first, but don't delete yet
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    try {
      // Log the profile deletion event before deleting the user
      await Analytics.create({
        eventType: 'delete_profile',
        user: user._id,
        ip: req.ip,
        referrer: req.get('referrer'),
        details: { status: 'successful' }
      });
    } catch (analyticsError) {
      console.error('Analytics logging error:', analyticsError.message);
      // You might choose to proceed with deletion even if analytics logging fails
    }

    // Now delete the user
    await User.findByIdAndDelete(req.user.id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('User deletion error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller to get only admin users
const getAdminUsers = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('name email role');
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin users' });
  }
};

const getUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('isVerified subscriptionStatus oneOffPaymentStatus subscriptionTier role googleId');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Automatically verify admins and Google-authenticated users
    if (!user.isVerified && (user.role === 'admin' || user.googleId)) {
      user.isVerified = true;
      await user.save();
    }

    // Determine if the user has an active subscription program
    const hasActiveProgram = user.subscriptionStatus === 'active';

    // Determine if the user has an active one-time payment
    const hasActiveOneTimePayment = user.subscriptionTier === 'one-off' && user.oneOffPaymentStatus === 'completed';

    // Return the user's verification status, active subscription status, and one-time payment status
    res.json({ 
      isVerified: user.isVerified, 
      hasActiveProgram,
      hasActiveOneTimePayment,
      subscriptionStatus: user.subscriptionStatus,
      oneOffPaymentStatus: user.oneOffPaymentStatus,
    });
  } catch (error) {
    console.error('Error fetching user status:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUsersSubscriptionStatus = async (req, res) => {
  try {
    // Fetch all users and select the necessary fields
    const users = await User.find({})
      .select('username email isVerified subscriptionStatus oneOffPaymentStatus subscriptionTier role googleId')
      .exec();

    const usersStatus = users.map(user => ({
      username: user.username,
      email: user.email,
      isVerified: user.isVerified || user.role === 'admin' || Boolean(user.googleId),
      subscriptionStatus: user.subscriptionStatus,
      oneOffPaymentStatus: user.oneOffPaymentStatus,
      subscriptionTier: user.subscriptionTier,
      hasActiveProgram: user.subscriptionStatus === 'active',
      hasActiveOneTimePayment: user.subscriptionTier === 'one-off' && user.oneOffPaymentStatus === 'completed',
    }));

    res.json(usersStatus);
  } catch (error) {
    console.error('Error fetching users subscription status:', error); // Log the full error object
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getActiveParticipantsCount = async (req, res) => {
  try {
    // Count the number of users with an active subscription or a completed one-time payment
    const activeParticipantsCount = await User.countDocuments({
      $or: [
        { subscriptionStatus: 'active' },
        { oneOffPaymentStatus: 'completed' }
      ]
    });

    res.status(200).json({ activeParticipantsCount });
  } catch (error) {
    console.error('Error fetching active participants count:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add user information to the user's profile
const addUserInfo = async (req, res) => {
  try {
    const { name, age, gender } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add user info to the user's info array
    user.info.push({ name, age, gender });
    await user.save();

    res.status(200).json({ message: 'User information added successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


module.exports = {
  updateUser,
  updateUserProfile,
  deleteUserProfile,
  getAdminUsers,
  confirmPasswordReset,
  confirmEmailVerification,
  getUserStatus,
  getUsersSubscriptionStatus,
  getActiveParticipantsCount,
  addUserInfo,
};
