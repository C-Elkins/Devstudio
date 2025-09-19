const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const { logger, httpLogger } = require('./logger');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

// Request ID middleware
app.use((req, res, next) => {
  const existing = req.headers['x-request-id'];
  const id = existing || uuidv4();
  req.id = id;
  res.setHeader('X-Request-Id', id);
  next();
});

// Pino http logger (includes request id)
app.use(httpLogger);

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting - more restrictive
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Reduced from 100 to 50 requests per window
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 900 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Only 5 contact form submissions per hour
  message: {
    error: 'Too many contact form submissions. Please try again later.',
    retryAfter: 3600
  }
});

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/projects', require('./routes/projects'));
app.use('/api/contact', contactLimiter, require('./routes/contact'));
app.use('/api/testimonials', require('./routes/testimonials'));
// Admin routes (auth + management)
app.use('/api/admin', require('./routes/admin'));
// Public bug endpoint
app.use('/api/bug', require('./routes/bug'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'DevStudio API is running',
    timestamp: new Date().toISOString() 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Structured logging of error
  logger.error({ reqId: req && req.id, err }, 'Unhandled error');

  // Capture to Sentry if available
  try {
    const Sentry = require('@sentry/node');
    if (Sentry && process.env.SENTRY_DSN) Sentry.captureException(err);
  } catch (_) {}

  const statusCode = err && err.status ? err.status : 500;
  const response = {
    message: err && err.message ? err.message : 'Something went wrong!'
  };

  // Only include error details in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err && err.stack ? err.stack : undefined;
  }

  res.status(statusCode).json(response);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info({ port: PORT, env: process.env.NODE_ENV || 'development' }, 'Server started');
  logger.info({ url: `http://localhost:${PORT}/api` }, 'API URL');
});

// Seed an initial admin in development if none exists (safe default)
(async function seedAdmin() {
  try {
    const Admin = require('./models/Admin').default;
    const count = await Admin.countDocuments();
    if (count === 0 && process.env.NODE_ENV !== 'production') {
      const username = process.env.INIT_ADMIN_USERNAME || 'admin';
      const password = process.env.INIT_ADMIN_PASSWORD || 'admin';
      await Admin.createAdmin(username, password, process.env.INIT_ADMIN_EMAIL || 'admin@example.com');
      logger.info('Seeded initial admin (dev only).');
    }
  } catch (err) {
    logger.warn({ err }, 'Could not seed admin');
  }
})();

// Readiness endpoint - checks DB connection
app.get('/api/readiness', (req, res) => {
  const mongoose = require('mongoose');
  // mongoose.readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const ready = mongoose.connection && mongoose.connection.readyState === 1;
  if (ready) return res.status(200).json({ ready: true });
  return res.status(503).json({ ready: false });
});