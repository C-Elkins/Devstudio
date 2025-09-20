const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { logger } = require('../logger');

const router = express.Router();

// POST /api/contact - submit contact form
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('message').trim().isLength({ min: 10, max: 2000 }).escape(),
  body('honeypot').optional().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    // Basic honeypot spam trap
    if (req.body.honeypot) {
      return res.status(200).json({ success: true, message: 'Thanks!' });
    }

    const { name, email, message } = req.body;
    const entry = await Contact.create({ name, email, message });
    res.status(201).json({ success: true, message: 'Message received', data: { id: entry._id } });
  } catch (err) {
    logger.error({ err }, 'Contact form error');
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
