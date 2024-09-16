const User = require('../models/User');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const generate2FASecret = async (req, res) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  const user = await User.findById(req.user.id);

  user.twoFactorSecret = secret.base32;
  await user.save();

  const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

  res.json({ qrCodeUrl, secret: secret.base32 });
};

const verify2FAToken = async (req, res) => {
  const { token } = req.body;
  const user = await User.findById(req.user.id);

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
  });

  if (verified) {
    user.twoFactorEnabled = true;
    await user.save();
    res.json({ message: '2FA enabled successfully' });
  } else {
    res.status(401).json({ message: 'Invalid 2FA token' });
  }
};

const disable2FA = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.twoFactorEnabled = false;
      user.twoFactorSecret = undefined; // Optionally clear the secret
  
      await user.save();
  
      res.json({ message: '2FA disabled successfully', user });
    } catch (error) {
      console.error('Error disabling 2FA:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  module.exports = { disable2FA };
  

module.exports = {
  generate2FASecret,
  verify2FAToken,
  disable2FA,
};
// LEFT OFF HERE, REDO ! TO COMPARE LOGIC IN CHAT // FINISH 2FA LOGIN