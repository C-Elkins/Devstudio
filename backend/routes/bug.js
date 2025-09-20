const express = require('express');
const { body, validationResult } = require('express-validator');
const BugReport = require('../models/BugReport');
const { logger } = require('../logger');

const router = express.Router();

// POST /api/bug - public endpoint to submit bug reports
router.post('/', [
  body('title').trim().isLength({ min: 3, max: 200 }).escape(),
  body('description').trim().isLength({ min: 10, max: 5000 }).escape(),
  body('url').optional().isURL().trim(),
  body('reporterEmail').optional().isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const bug = await BugReport.create(req.body);
    res.status(201).json({ success: true, data: bug });
  } catch (err) {
    logger.error({ err }, 'Bug report creation failed');
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
