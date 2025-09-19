// Simple logger for frontend application

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = {
  log: (message, ...args) => {
    if (isDevelopment) {
      console.log(`[LOG] ${message}`, ...args);
    }
  },
  
  info: (message, ...args) => {
    console.info(`[INFO] ${message}`, ...args);
  },
  
  warn: (message, ...args) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  
  error: (message, ...args) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  
  debug: (message, ...args) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
};

export default logger;