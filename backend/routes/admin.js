const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { body, validationResult } = require('express-validator');
const { logger } = require('../logger');
const BugReport = require('../models/BugReport');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'devstudio-secret';
const TOKEN_EXPIRY = '2h';

// Auth middleware
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Role-based middleware
function requireRole(role) {
  return function (req, res, next) {
    if (!req.admin || !req.admin.role || req.admin.role !== role) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}

// POST /api/admin/login - returns JWT
router.post('/login', [
  body('username').exists(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await admin.verifyPassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    // 2FA check
    if (admin.twoFAEnabled) {
      if (!req.body.twoFAToken) {
        return res.status(401).json({ message: '2FA token required' });
      }
      const verified = speakeasy.totp.verify({
        secret: admin.twoFASecret,
        encoding: 'base32',
        token: req.body.twoFAToken
      });
      if (!verified) return res.status(401).json({ message: 'Invalid 2FA token' });
    }
    const token = jwt.sign({ id: admin._id, username: admin.username, role: admin.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    res.json({ success: true, token });
  } catch (err) {
    logger.error({ err }, 'Login error');
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/create - conditional initial creation without auth
router.post('/create', [
  body('username').isLength({ min: 3 }).withMessage('Username too short'),
  body('password').isLength({ min: 6 }).withMessage('Password too short'),
  body('email').optional().isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password, email } = req.body;
    const count = await Admin.countDocuments();

    if (count === 0) {
      const admin = await Admin.createAdmin(username, password, email);
      logger.info({ admin: admin.username }, 'Initial admin created');
      return res.json({ success: true, message: 'Admin created' });
    }

    // Require superadmin if admins exist
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
    const token = auth.split(' ')[1];
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    if (!payload.role || payload.role !== 'superadmin') {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }

    const admin = await Admin.createAdmin(username, password, email);
    logger.info({ admin: admin.username }, 'Admin created by admin');
    res.json({ success: true, message: 'Admin created' });
  } catch (err) {
    logger.error({ err }, 'Error creating admin');
    res.status(500).json({ message: 'Could not create admin' });
  }
});

// GET /api/admin/list - list admins (superadmin only)
router.get('/list', authMiddleware, requireRole('superadmin'), async (req, res) => {
  try {
    const admins = await Admin.find({}, 'username email role twoFAEnabled').lean();
    res.json({ success: true, data: admins });
  } catch (err) {
    logger.error({ err }, 'Error listing admins');
    res.status(500).json({ message: 'Could not list admins' });
  }
});

// GET /api/admin/dashboard - returns site metrics
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const Contact = require('../models/Contact');
    const totalContacts = await Contact.countDocuments();
    const unresponded = await Contact.countDocuments({ responded: false });
    const recentBugs = await BugReport.find().sort({ createdAt: -1 }).limit(10).lean();
    res.json({ success: true, data: { totalContacts, unresponded, recentBugs } });
  } catch (err) {
    logger.error({ err }, 'Error building dashboard');
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/bugs - list bug reports (auth required)
router.get('/bugs', authMiddleware, async (req, res) => {
  try {
    const bugs = await BugReport.find().sort({ createdAt: -1 }).limit(200).lean();
    res.json({ success: true, data: bugs });
  } catch (err) {
    logger.error({ err }, 'Error listing bugs');
    res.status(500).json({ message: 'Server error' });
  }
});

// 2FA setup (admin only)
router.post('/2fa/setup', authMiddleware, async (req, res) => {
  const admin = await Admin.findById(req.admin.id);
  if (!admin) return res.status(404).json({ message: 'Admin not found' });
  if (admin.twoFAEnabled) return res.status(400).json({ message: '2FA already enabled' });
  const secret = speakeasy.generateSecret({ name: `DevStudio (${admin.username})` });
  admin.twoFASecret = secret.base32;
  await admin.save();
  const otpauth = secret.otpauth_url;
  const qr = await qrcode.toDataURL(otpauth);
  res.json({ otpauth, qr });
});

// 2FA enable (admin only)
router.post('/2fa/enable', authMiddleware, async (req, res) => {
  const { token } = req.body;
  const admin = await Admin.findById(req.admin.id);
  if (!admin || !admin.twoFASecret) return res.status(400).json({ message: '2FA setup required' });
  const verified = speakeasy.totp.verify({
    secret: admin.twoFASecret,
    encoding: 'base32',
    token
  });
  if (!verified) return res.status(401).json({ message: 'Invalid 2FA token' });
  admin.twoFAEnabled = true;
  await admin.save();
  res.json({ success: true, message: '2FA enabled' });
});

// 2FA disable (admin only)
router.post('/2fa/disable', authMiddleware, async (req, res) => {
  const { token } = req.body;
  const admin = await Admin.findById(req.admin.id);
  if (!admin || !admin.twoFASecret) return res.status(400).json({ message: '2FA not enabled' });
  const verified = speakeasy.totp.verify({
    secret: admin.twoFASecret,
    encoding: 'base32',
    token
  });
  if (!verified) return res.status(401).json({ message: 'Invalid 2FA token' });
  admin.twoFAEnabled = false;
  admin.twoFASecret = undefined;
  await admin.save();
  res.json({ success: true, message: '2FA disabled' });
});

// READ-ONLY: tail recent logs (admin only)
router.get('/logs', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const logPath = process.env.API_LOG_PATH || path.join(__dirname, '..', 'logs', 'app.log');
    if (!fs.existsSync(logPath)) return res.json({ success: true, data: [] });
    const content = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
    const last = content.slice(-200);
    res.json({ success: true, data: last });
  } catch (err) {
    logger.error({ err }, 'Error reading logs');
    res.status(500).json({ message: 'Could not read logs' });
  }
});

// READ-ONLY: server info (admin only)
router.get('/server-info', authMiddleware, requireRole('admin'), async (_req, res) => {
  try {
    res.json({
      success: true,
      data: {
        node: process.version,
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        env: process.env.NODE_ENV || 'development'
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch server info' });
  }
});

// SMALL TASK: trigger cache warm (no code changes, no shutdowns)
router.post('/tasks/warm-cache', authMiddleware, requireRole('admin'), async (_req, res) => {
  try {
    // Placeholder: simulate a non-destructive admin task
    setTimeout(() => void 0, 0);
    res.json({ success: true, message: 'Cache warm triggered' });
  } catch (err) {
    res.status(500).json({ message: 'Task failed' });
  }
});

module.exports = router;
