const express = require('express');
const passport = require('passport');
const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  verifyAuth,
  getDashboard,
  validateEmailProvider,
} = require('../controllers/authController');
const {
  sendVerification,
  verifyEmail
} = require('../controllers/emailController');
const {
  requestPasswordReset,
  resetPassword
} = require('../controllers/passwordController');
const {
  generate2FASecret,
  verify2FAToken,
  disable2FA
} = require('../controllers/2FAController'); // Import 2FA controller
const {
  protect, // Consolidated protect middleware
  generateAccessToken,   // Import generateAccessToken
  generateRefreshToken   // Import generateRefreshToken
} = require('../middlewares/authMiddleware');
// const verifyCaptcha = require('../middlewares/captchaMiddleware');
const {
  verifyCsrfToken
} = require('../utils/csrfUtils');
const router = express.Router();

// Registration route
router.post('/register', validateEmailProvider, async (req, res) => { // For production, ADD 'verifyCaptcha,'
  try {
    await registerUser(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => { // For production, 'ADD verifyCaptcha,'
  try {
    await loginUser(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Refresh token route
router.post('/refresh-token', async (req, res) => {
  try {
    const csrfValid = verifyCsrfToken(req.cookies['XSRF-TOKEN']);
    if (!csrfValid) {
      return res.status(403).json({ message: 'Invalid CSRF token' });
    }
    await refreshAccessToken(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Dashboard route
router.get('/dashboard', protect, async (req, res) => { // Updated to use protect middleware
  try {
    await getDashboard(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout route
router.post('/logout', async (req, res) => {
  try {
    const csrfValid = verifyCsrfToken(req.cookies['XSRF-TOKEN']);
    if (!csrfValid) {
      return res.status(403).json({ message: 'Invalid CSRF token' });
    }
    await logoutUser(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify authentication route
router.get('/verify', protect, verifyAuth); // Ensure this is not called redundantly in the client

// Determine the appropriate client URL based on the environment
const clientUrl = process.env.NODE_ENV === 'production'
  ? 'https://yourbusinessdomain.com'
  : 'https://localhost:5173';

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['openid', 'profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${clientUrl}/login` }),
  (req, res) => {
    if (req.user) {
      console.log('User authenticated successfully:', req.user);
      const accessToken = generateAccessToken(req.user.id);
      const refreshToken = generateRefreshToken(req.user.id);

      res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: true, // Ensures cookies are only sent over HTTPS
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true, // Ensures cookies are only sent over HTTPS
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.redirect(`${clientUrl}/dashboard`);
    } else {
      console.log('User authentication failed');
      res.redirect(`${clientUrl}/login`);
    }
  }
);

// Email verification routes
router.post('/send-verification', protect, sendVerification);
router.get('/verify-email', verifyEmail);

// Password reset routes
router.post('/request-reset-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

// 2FA routes
router.get('/2fa/generate', protect, generate2FASecret); // Generate TOTP secret and QR code
router.post('/2fa/verify', protect, verify2FAToken); // Verify TOTP token
// Disable 2FA route
router.post('/2fa/disable', protect, disable2FA);

module.exports = router;
