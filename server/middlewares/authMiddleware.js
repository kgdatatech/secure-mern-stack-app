const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyCsrfToken } = require('../utils/csrfUtils');

// Trusted email providers list
const popularProviders = [
  'gmail.com',           // Google
  'outlook.com',         // Microsoft Outlook
  'hotmail.com',         // Microsoft Hotmail
  'live.com',            // Microsoft Live
  'msn.com',             // Microsoft MSN
  'icloud.com',          // Apple iCloud
  'me.com',              // Apple Me
  'mac.com',             // Apple Mac
  'yahoo.com',           // Yahoo
  'aol.com'              // AOL Mail
];

const privacyProviders = [
  'protonmail.com',      // ProtonMail
  'tutanota.com',        // Tutanota
  'fastmail.com',        // Fastmail
  'hushmail.com'         // Hushmail
];

const ispProviders = [
  'att.net',             // AT&T
  'sbcglobal.net',       // AT&T (SBC Global)
  'comcast.net',         // Comcast
  'verizon.net',         // Verizon
  'charter.net',         // Spectrum (Charter)
  'twc.com',             // Spectrum (Time Warner Cable)
  'cox.net'              // Cox
];

const otherProviders = [
  'zoho.com',            // Zoho Mail
  'mail.com',            // Mail.com
  'gmx.com'              // GMX Mail
];

const corporateEducationalProviders = [
  'example.com',         // Placeholder for corporate domains
  '.edu'                 // Educational institutions
];

const trustedEmailProviders = [
  ...popularProviders,
  ...privacyProviders,
  ...ispProviders,
  ...otherProviders,
  ...corporateEducationalProviders
];

const generateAccessToken = (id, expiresIn = process.env.ACCESS_TOKEN_EXPIRATION) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
};

const protect = async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      // If session-based authentication is already established, proceed
      return next();
    }

    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: 'Authorization token is missing. Please log in again.' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized', error: error.message });
  }
};

const roleMiddleware = (roles) => (req, res, next) => {
  if (req.user && roles.includes(req.user.role)) {
    return next();
  }
  res.status(403).json({ message: 'Forbidden' });
};

const csrfProtection = (req, res, next) => {
  const csrfToken = req.headers['x-csrf-token'] || req.body.csrfToken; // Handle CSRF token from headers or body
  if (!csrfToken || !verifyCsrfToken(csrfToken)) {
    return res.status(403).json({ message: 'Forbidden request, invalid CSRF token' });
  }
  next();
};

// New Email Validation Middleware
const validateEmailProvider = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const emailDomain = email.split('@')[1];
  if (!trustedEmailProviders.some(provider => emailDomain.endsWith(provider))) {
    return res.status(400).json({ message: 'Email provider is not trusted' });
  }

  next();
};

module.exports = { protect, roleMiddleware, generateAccessToken, generateRefreshToken, csrfProtection, validateEmailProvider };
