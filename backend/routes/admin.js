const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin').default;
const { body, validationResult } = require('express-validator');
const { logger } = require('../logger');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'devstudio-secret';
const TOKEN_EXPIRY = '2h';
const BugReport = require('../models/BugReport');

// GET /api/admin/dashboard - returns site metrics
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const totalContacts = await require('../models/Contact').countDocuments();
    const unresponded = await require('../models/Contact').countDocuments({ responded: false });
    const recentBugs = await BugReport.find().sort({ createdAt: -1 }).limit(10).lean();
    res.json({ success: true, data: { totalContacts, unresponded, recentBugs } });
  } catch (err) {
    logger.error({ err }, 'Error building dashboard');
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/bug - create a bug report (public)
router.post('/bug', async (req, res) => {
  try {
    const { title, description, url, reporterEmail } = req.body;
    const bug = await BugReport.create({ title, description, url, reporterEmail });
    res.status(201).json({ success: true, data: bug });
  } catch (err) {
    logger.error({ err }, 'Error creating bug report');
    res.status(500).json({ message: 'Could not create bug report' });
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

// Helper middleware to protect routes
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

// POST /api/admin/create - create admin
// If no admins exist, allow creation (initial setup). Otherwise require auth.
router.post('/create', [
  body('username').isLength({ min: 3 }).withMessage('Username too short'),
  body('password').isLength({ min: 6 }).withMessage('Password too short')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password, email } = req.body;
    const count = await Admin.countDocuments();

    if (count === 0) {
      // initial creation allowed
      const admin = await Admin.createAdmin(username, password, email);
      logger.info({ admin: admin.username }, 'Initial admin created');
      return res.json({ success: true, message: 'Admin created' });
    }

    // If admins already exist, require auth to create another admin
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
    const token = auth.split(' ')[1];
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // create additional admin
    const admin = await Admin.createAdmin(username, password, email);
    logger.info({ admin: admin.username }, 'Admin created by admin');
    res.json({ success: true, message: 'Admin created' });
  } catch (err) {
    logger.error({ err }, 'Error creating admin');
    res.status(500).json({ message: 'Could not create admin' });
  }
});

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

    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    res.json({ success: true, token });
  } catch (err) {
    logger.error({ err }, 'Login error');
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
