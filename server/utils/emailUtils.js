const nodemailer = require('nodemailer');

// Create the transporter with more options for security and flexibility
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use SSL (true for port 465, false for STARTTLS port 587)
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV !== 'production' // Ensure true in production for security
  }
});

// Utility function to send an email with proper validation
const sendEmail = async (mailOptions) => {
  if (!mailOptions.to) {
    console.error('Error: No recipients defined');
    throw new Error('No recipients defined');
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${mailOptions.to}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
};

// Base template for all emails
const generateEmailTemplate = (subject, content) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;"> <!-- indigo-950 -->
    <div style="padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #4d7c0f; border-radius: 5px;"> <!-- lime-600 -->
      <h2 style="color: #1e293b;">${subject}</h2> <!-- indigo-950 -->
      ${content}
      <p style="font-size: 14px; color: #94a3b8;">Thank you,<br>Secure MERN Stack Team</p> <!-- lighter indigo-950 for signature -->
    </div>
  </div>
`;

// Send a verification email with a token
const sendVerificationEmail = async (user, token) => {
  const url = `${process.env.CLIENT_URL}/auth/verify-email?token=${token}`;
  const subject = 'Verify Your Email Address';
  const content = `
    <p>Dear ${user.name},</p>
    <p>Thank you for registering. Please confirm your email address by clicking the link below. This link will expire in 15 minutes:</p>
    <p><a href="${url}" style="color: #4d7c0f;">Verify Email</a></p> <!-- lime-600 -->
    <p><strong>Do not share this link with anyone.</strong></p>
    <p>If you did not request this, please ignore this email.</p>
  `;

  const mailOptions = {
    from: `"Secure MERN Stack" <${process.env.EMAIL}>`,
    to: user.email,
    subject: subject,
    html: generateEmailTemplate(subject, content),
  };

  await sendEmail(mailOptions);
};

// Send a reset password email with a token
const sendResetPasswordEmail = async (user, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const subject = 'Reset Your Password';
  const content = `
    <p>Dear ${user.name},</p>
    <p>You have requested to reset your password. Please click the link below to reset it. This link will expire in one hour:</p>
    <p><a href="${url}" style="color: #4d7c0f;">Reset Password</a></p> <!-- lime-600 -->
    <p>If you did not request this, please ignore this email.</p>
  `;

  const mailOptions = {
    from: `"Secure MERN Stack" <${process.env.EMAIL}>`,
    to: user.email,
    subject: subject,
    html: generateEmailTemplate(subject, content),
  };

  await sendEmail(mailOptions);
};

// Send an email to notify the user of a successful password reset
const sendPasswordResetConfirmationEmail = async (user) => {
  const subject = 'Your Password Has Been Reset Successfully';
  const content = `
    <p>Dear ${user.name},</p>
    <p>Your password has been reset successfully. If you did not initiate this request, please contact our support team immediately.</p>
  `;

  const mailOptions = {
    from: `"Secure MERN Stack" <${process.env.EMAIL}>`,
    to: user.email,
    subject: subject,
    html: generateEmailTemplate(subject, content),
  };

  await sendEmail(mailOptions);
};

// Send a general notification email
const sendNotificationEmail = async (user, subject, message) => {
  const content = `
    <p>Dear ${user.name},</p>
    <p>${message}</p>
  `;

  const mailOptions = {
    from: `"Secure MERN Stack" <${process.env.EMAIL}>`,
    to: user.email,
    subject: subject,
    html: generateEmailTemplate(subject, content),
  };

  await sendEmail(mailOptions);
};

// Send a newsletter to multiple users separately
const sendBulkNewsletter = async (emails, subject, message) => {
  try {
    console.log('Sending bulk emails:', emails); // Log the emails being sent
    for (const email of emails) {
      if (!email) continue;

      const content = `
        <p>Dear ${email},</p>
        <p>${message}</p>
      `;

      const mailOptions = {
        from: `"Secure MERN Stack" <${process.env.EMAIL}>`,
        to: email,
        subject: subject,
        html: generateEmailTemplate(subject, content),
      };

      await sendEmail(mailOptions);
    }
    console.log('Newsletter sent to all users successfully!');
  } catch (error) {
    console.error('Error sending newsletter:', error);
    throw error;
  }
};

// Send a chat message notification email to the recipient
const sendChatNotificationEmail = async (user, sender, message) => {
  if (!user.email || !sender.email) {
    console.error('Error: No recipients defined for chat notification email');
    throw new Error('No recipients defined');
  }

  // Ensure we only send an email to the recipient, not the sender
  if (user.email !== sender.email) {
    const dashboardUrl = `${process.env.CLIENT_URL}/dashboard`; // Redirects to login if not authenticated
    const subject = 'New Chat Message Notification';
    const content = `
      <p>Hello, ${user.name}</p>
      <p>You have received a new message from <strong>${sender.name}</strong>:</p>
      <blockquote style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #1e293b;"> <!-- indigo-950 -->
        <p style="font-style: italic; color: #555;">"${message}"</p>
      </blockquote>
      <p>Please log in to your account to view and respond to the message:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${dashboardUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #4d7c0f; text-decoration: none; border-radius: 5px;"> <!-- lime-600 -->
          Go to Your Dashboard
        </a>
      </div>
    `;

    const mailOptions = {
      from: `"Secure MERN Stack" <${process.env.EMAIL}>`,
      to: user.email,
      subject: subject,
      html: generateEmailTemplate(subject, content),
    };

    await sendEmail(mailOptions);
  }
};

// Send an email to the admin when a new user registers
const sendNewUserRegistrationEmail = async (user, adminEmail) => {
  if (!adminEmail) {
    console.error('Error: Admin email is not defined for new user registration');
    throw new Error('Admin email is not defined');
  }

  const subject = 'New User Registration';
  const content = `
    <p>Dear Admin,</p>
    <p>A new user has registered:</p>
    <p><strong>Name:</strong> ${user.name}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p>Please log in to the admin dashboard to view more details.</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${process.env.CLIENT_URL}/admin/dashboard" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #4d7c0f; text-decoration: none; border-radius: 5px;"> <!-- lime-600 -->
        Go to Admin Dashboard
      </a>
    </div>
  `;

  const mailOptions = {
    from: `"Secure MERN Stack" <${process.env.EMAIL}>`,
    to: adminEmail,
    subject: subject,
    html: generateEmailTemplate(subject, content),
  };

  await sendEmail(mailOptions);
};

// Send an email to the admin when a user subscribes or makes a one-off payment
const sendPaymentNotificationEmail = async (user, adminEmail, paymentType) => {
  if (!adminEmail) {
    console.error('Error: Admin email is not defined for payment notification');
    throw new Error('Admin email is not defined');
  }

  const subject = `New ${paymentType} Payment`;
  const content = `
    <p>Dear Admin,</p>
    <p>User ${user.name} has made a ${paymentType} payment.</p>
    <p>Email: ${user.email}</p>
  `;

  const mailOptions = {
    from: `"Secure MERN Stack" <${process.env.EMAIL}>`,
    to: adminEmail,
    subject: subject,
    html: generateEmailTemplate(subject, content),
  };

  await sendEmail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendPasswordResetConfirmationEmail,
  sendNotificationEmail,
  sendBulkNewsletter,
  sendChatNotificationEmail,
  sendNewUserRegistrationEmail,
  sendPaymentNotificationEmail
};
