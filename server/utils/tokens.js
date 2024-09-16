// server\utils\tokens.js

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

// Utility function to generate a verification token
const generateVerificationToken = () => {
  // Generate a random token
  const token = crypto.randomBytes(32).toString('hex');
  
  // Hash the token for storage in the database
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  return { token, hashedToken };
};

module.exports = { generateAccessToken, generateRefreshToken, generateVerificationToken };
