const express = require('express');
const router = express.Router();
const BugReport = require('../models/BugReport');
const { logger } = require('../logger');

// Public POST /api/bug
router.post('/', async (req, res) => {
  try {
    const { title, description, url, reporterEmail } = req.body;
    const bug = await BugReport.create({ title, description, url, reporterEmail });
    res.status(201).json({ success: true, data: bug });
  } catch (err) {
    logger.error({ err }, 'Error creating public bug report');
    res.status(500).json({ message: 'Could not create bug report' });
  }
});

module.exports = router;
