const mongoose = require('mongoose');
const { logger } = require('../logger');
let Sentry;
try {
  Sentry = require('@sentry/node');
} catch (_) {
  Sentry = null;
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/devstudio', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

  logger.info({ host: conn.connection.host }, 'MongoDB connected');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error({ err }, 'MongoDB connection error');
      if (Sentry) Sentry.captureException(err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error({ err: error }, 'Database connection failed');
    if (Sentry) Sentry.captureException(error);
    throw error;
  }
};

module.exports = connectDB;