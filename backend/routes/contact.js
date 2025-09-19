const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');
const { logger } = require('../logger');

const router = express.Router();

// Simple HTML escape to prevent injection in email HTML bodies
function escapeHtml(str) {
  if (!str && str !== 0) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter configuration at startup (non-blocking)
transporter.verify().then(() => {
  const { logger } = require('../logger');
  logger.info('Email transporter is configured correctly');
}).catch((err) => {
  const { logger } = require('../logger');
  logger.warn({ err: err && err.message ? err.message : err }, 'Email transporter verification failed. Email may not send');
});

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name is required and must be less than 100 characters'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name must be less than 100 characters')
], async (req, res) => {
  try {
  logger.info({ reqId: req.id, route: 'POST /api/contact' }, 'Incoming contact submission');
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
  logger.warn({ reqId: req.id, errors: errors.array() }, 'Validation failed for contact submission');
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

  const { name, email, message, phone, company, projectType, budget, timeline } = req.body;
  // escape fields for use in HTML emails
  const escName = escapeHtml(name);
  const escEmail = escapeHtml(email);
  const escPhone = escapeHtml(phone);
  const escCompany = escapeHtml(company);
  const escProjectType = escapeHtml(projectType);
  const escBudget = escapeHtml(budget);
  const escTimeline = escapeHtml(timeline);
  const escMessage = escapeHtml(message);

    // Check for spam (simple rate limiting by email)
    const recentContact = await Contact.findOne({
      email,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });

    if (recentContact) {
      return res.status(429).json({
        success: false,
        message: 'You have already submitted a contact form in the last 24 hours. Please wait before submitting again.'
      });
    }

    // Create contact record
    const contact = new Contact({
      name,
      email,
      message,
      phone,
      company,
      projectType,
      budget,
      timeline,
      source: 'Website'
    });

    await contact.save();
  logger.info({ reqId: req.id, id: contact._id }, 'Contact saved');

    // Send notification email to admin
    const adminEmailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escName}</p>
      <p><strong>Email:</strong> ${escEmail}</p>
      ${escPhone ? `<p><strong>Phone:</strong> ${escPhone}</p>` : ''}
      ${escCompany ? `<p><strong>Company:</strong> ${escCompany}</p>` : ''}
      ${escProjectType ? `<p><strong>Project Type:</strong> ${escProjectType}</p>` : ''}
      ${escBudget ? `<p><strong>Budget:</strong> ${escBudget}</p>` : ''}
      ${escTimeline ? `<p><strong>Timeline:</strong> ${escTimeline}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${escMessage.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
    `;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@devstudio.com',
        to: process.env.ADMIN_EMAIL || 'admin@devstudio.com',
        subject: `New Contact Form - ${name}`,
        html: adminEmailHtml
      });
    } catch (emailError) {
  logger.error({ reqId: req.id, err: emailError }, 'Failed to send admin notification email');
      // Don't fail the request if email fails
    }

    // Send confirmation email to user
    const userEmailHtml = `
      <h2>Thank You for Contacting DevStudio!</h2>
      <p>Hi ${escName},</p>
      <p>Thank you for reaching out to us. We've received your message and will get back to you within 24 hours.</p>
      <p>Here's a copy of your message:</p>
      <blockquote style="border-left: 4px solid #7c3aed; padding-left: 16px; margin: 16px 0;">
        ${escMessage.replace(/\n/g, '<br>')}
      </blockquote>
      <p>Best regards,<br>The DevStudio Team</p>
    `;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'hello@devstudio.com',
        to: email,
        subject: 'Thank you for contacting DevStudio',
        html: userEmailHtml
      });
    } catch (emailError) {
  logger.error({ reqId: req.id, err: emailError }, 'Failed to send user confirmation email');
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        createdAt: contact.createdAt
      }
    });

  } catch (error) {
  logger.error({ reqId: req.id, err: error }, 'Error processing contact form');
    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error processing your request. Please try again.'
    });
  }
});

// @route   GET /api/contact
// @desc    Get all contact submissions (admin only)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, responded, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (responded !== undefined) query.responded = responded === 'true';
    
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip)
      .select('-__v');
    
    const total = await Contact.countDocuments(query);
    
    res.json({
      success: true,
      count: contacts.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: contacts
    });
  } catch (error) {
  logger.error({ err: error }, 'Error fetching contacts');
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contacts'
    });
  }
});

// @route   GET /api/contact/stats
// @desc    Get contact statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const [total, unresponded, thisMonth, byStatus] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ responded: false }),
      Contact.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Contact.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);
    
    res.json({
      success: true,
      data: {
        total,
        unresponded,
        thisMonth,
        byStatus: byStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching contact stats');
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contact statistics'
    });
  }
});

// @route   PUT /api/contact/:id/respond
// @desc    Mark contact as responded
// @access  Private
router.put('/:id/respond', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    await contact.markAsResponded();
    
    res.json({
      success: true,
      message: 'Contact marked as responded',
      data: contact
    });
  } catch (error) {
    logger.error({ err: error }, 'Error updating contact');
    res.status(500).json({
      success: false,
      message: 'Server error while updating contact'
    });
  }
});

module.exports = router;