const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, validateEmailProvider } = require('../middlewares/authMiddleware');
const { generateCsrfToken } = require('../utils/csrfUtils');
const speakeasy = require('speakeasy');
const Analytics = require('../models/Analytics');
const { sendNewUserRegistrationEmail } = require('../utils/emailUtils'); // Import the email utility

const registerUser = async (req, res) => {
  const { username, email, password, role, name, adminSecret } = req.body;

  try {
    // Validate the admin secret key for admin registration
    if (role === 'admin' && adminSecret !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: 'Invalid admin secret key' });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create and save the new user
    const user = new User({ username, email, password: hashedPassword, role, name });
    await user.save();

    // Send an email notification to the admin
    await sendNewUserRegistrationEmail(user, process.env.ADMIN_EMAIL);

    // Log the registration event to analytics
    const logData = {
      eventType: 'signup',
      user: user._id,
      ip: req.ip,
      referrer: req.get('referrer'),
      details: { role: user.role },
    };
    await Analytics.create(logData);

    // Generate and set CSRF token
    const csrfToken = generateCsrfToken();
    res.cookie('XSRF-TOKEN', csrfToken, {
      httpOnly: false,
      secure: true, // Ensures cookies are only sent over HTTPS
      sameSite: 'Strict'
    });

    res.status(201).json({ message: 'User registered successfully', csrfToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password, twoFactorCode } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      await Analytics.create({
        eventType: 'login',
        user: null,
        ip: req.ip,
        referrer: req.get('referrer'),
        details: { email, status: 'failed' },
      });
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await Analytics.create({
        eventType: 'login',
        user: user._id,
        ip: req.ip,
        referrer: req.get('referrer'),
        details: { status: 'failed' },
      });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        const tempJwt = generateAccessToken(user._id, '15m');
        res.cookie('tempJwt', tempJwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Ensure cookies are only sent over HTTPS in production
          sameSite: 'Strict',
        });
        return res.status(206).json({ twoFactorEnabled: true, message: '2FA code required' });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorCode,
      });

      if (!verified) {
        await Analytics.create({
          eventType: 'login',
          user: user._id,
          ip: req.ip,
          referrer: req.get('referrer'),
          details: { status: 'failed', reason: 'Invalid 2FA code' },
        });
        return res.status(401).json({ message: 'Invalid 2FA code' });
      }
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensure cookies are only sent over HTTPS in production
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensure cookies are only sent over HTTPS in production
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    await Analytics.create({
      eventType: 'login',
      user: user._id,
      ip: req.ip,
      referrer: req.get('referrer'),
      details: { status: 'successful' },
    });

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error.message); // Log error for debugging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate 2FA Secret
const generate2FASecret = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({ length: 20 });
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.twoFactorSecret = secret.base32;
    await user.save();

    res.json({
      message: '2FA secret generated successfully',
      otpauth_url: secret.otpauth_url, // This is the URL you can use to generate a QR code
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate 2FA secret', error: error.message });
  }
};

// Verify 2FA Code
const verify2FACode = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isVerified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
    });

    if (!isVerified) {
      return res.status(400).json({ message: 'Invalid 2FA token' });
    }

    user.twoFactorEnabled = true;
    await user.save();

    res.status(200).json({ message: '2FA enabled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify 2FA token', error: error.message });
  }
};

// Disable 2FA
const disable2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();

    res.status(200).json({ message: '2FA disabled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to disable 2FA', error: error.message });
  }
};

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh token not provided' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = generateAccessToken(decoded.id);

    res.cookie('jwt', newAccessToken, {
      httpOnly: true,
      secure: true, // Ensures cookies are only sent over HTTPS
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Error refreshing access token:', error.message);
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

const verifyAuth = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching dashboard data:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const logoutUser = (req, res) => {
  req.logout(async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Server error during logout', error: err.message });
    }
    req.session.destroy(async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Server error during session destroy', error: err.message });
      }
      res.clearCookie('connect.sid', { path: '/' });
      res.clearCookie('jwt');
      res.clearCookie('refreshToken');
      res.clearCookie('tempJwt');

      // Log the logout event
      if (req.user) {
        await Analytics.create({
          eventType: 'logout',
          user: req.user._id,
          ip: req.ip,
          referrer: req.get('referrer'),
          details: { status: 'successful' },
        });
      }

      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getDashboard,
  verifyAuth,
  validateEmailProvider,
  generate2FASecret, // Added to export the generate2FASecret function
  verify2FACode, // Added to export the verify2FACode function
  disable2FA // Added to export the disable2FA function
};
