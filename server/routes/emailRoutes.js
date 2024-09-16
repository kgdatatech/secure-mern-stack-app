// server/routes/emailRoutes.js

const express = require('express');
const router = express.Router();
const { sendBulkNewsletter } = require('../utils/emailUtils');

router.post('/send-bulk-newsletter', async (req, res) => {
  const { emails, subject, message } = req.body;

  if (!emails || !subject || !message) {
    return res.status(400).json({ message: 'Emails, subject, and message are required.' });
  }

  try {
    await sendBulkNewsletter(emails, subject, message);
    res.status(200).json({ message: 'Newsletter sent successfully!' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ message: 'Failed to send emails.', error: error.message });
  }
});

module.exports = router;
