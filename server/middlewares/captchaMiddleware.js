const axios = require('axios');

const verifyCaptcha = async (req, res, next) => {
  const token = req.body.captchaToken;

  if (!token) {
    return res.status(400).json({ message: 'Captcha token is missing' });
  }

  try {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token
      }
    });

    if (!response.data.success) {
      return res.status(400).json({ message: 'Captcha verification failed' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Captcha verification error', error: error.message });
  }
};

module.exports = verifyCaptcha;
