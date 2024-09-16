// Importing required modules
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { generateCsrfToken } = require('./utils/csrfUtils');
const initializeSocket = require('./utils/socket');
const errorMiddleware = require('./middlewares/errorMiddleware');

// Importing routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const programRoutes = require('./routes/programRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const cmsPageRoutes = require('./routes/cmsPageRoutes');
const emailRoutes = require('./routes/emailRoutes');

// Check for required environment variables
if (!process.env.SESSION_SECRET || !process.env.MONGO_URI || !process.env.CLIENT_URL || !process.env.PORT) {
  throw new Error('Missing required environment variables');
}

// Initialize express app
const app = express();

// Enable trust proxy
app.set('trust proxy', 1); // Trust first proxy (needed for Render and similar platforms)

// Set up MongoDB connection
connectDB();

// Set up Passport
require('./config/passport');

// Webhook route should be registered before body parsing middleware
app.post('/api/subscription/webhook', express.raw({ type: 'application/json' }), require('./controllers/paymentController').handleStripeWebhook);

// Middlewares
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://accounts.google.com/gsi/client",
          "https://www.google.com/recaptcha/api.js",
          "https://www.gstatic.com",
          "https://js.stripe.com/v3",
          "https://js.stripe.com",
        ],
        connectSrc: [
          "'self'",
          "https://accounts.google.com",
          "https://www.google.com/recaptcha/api/siteverify",
          "https://api.stripe.com",
          "https://cdn.jsdelivr.net", // Added to allow connections to jsdelivr CDN
        ],
        imgSrc: [
          "'self'",
          "https://lh3.googleusercontent.com",
          "https://www.google.com/recaptcha/api/",
          "https://*.stripe.com",
        ],
        frameSrc: [
          "'self'",
          "https://accounts.google.com",
          "https://www.google.com",
          "https://js.stripe.com",
        ],
        objectSrc: ["'none'"], // Prevent loading plugins like Flash
        upgradeInsecureRequests: [], // Optional: Automatically upgrade HTTP to HTTPS
      },
    },
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    exposedHeaders: ['Content-Length', 'X-Kuma-Revision']
  })
);

app.use(morgan('common'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  keyGenerator: (req, res) => req.ip
});
app.use(limiter);

// Configure express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// CSRF token endpoint
app.get('/api/csrf-token', (req, res) => {
  const token = generateCsrfToken();
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict'
  });
  res.json({ csrfToken: token });
});

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/cmsPages', cmsPageRoutes);
app.use('/api', emailRoutes);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the 'client/dist' directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'dist')));

  // Serve the index.html file for any routes not matched by the API
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
}

// SSL certificates and server initialization
let server;
if (process.env.NODE_ENV === 'development') {
  const privateKey = fs.readFileSync(path.join(__dirname, 'certs', 'localhost-key.pem'), 'utf8');
  const certificate = fs.readFileSync(path.join(__dirname, 'certs', 'localhost.pem'), 'utf8');
  const credentials = { key: privateKey, cert: certificate };
  server = https.createServer(credentials, app);
} else {
  server = http.createServer(app);
}

// Initialize Socket.io with the server
const io = initializeSocket(server);

// Set the Socket.IO instance on the app instance
app.set('io', io);

// Error handling for Socket.IO initialization
if (!io) {
  throw new Error('Socket.IO initialization failed');
}

// Centralized error handler
app.use(errorMiddleware);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
