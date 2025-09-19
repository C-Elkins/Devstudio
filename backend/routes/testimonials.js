const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { logger } = require('../logger');
let Sentry;
try { Sentry = require('@sentry/node'); } catch (_) { Sentry = null; }

// Mock testimonials data (in real app, this would come from database)
const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "CEO, TechStart",
    company: "TechStart Inc.",
    text: "Absolutely transformative work. The attention to detail is incredible and the team delivered beyond our expectations.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b412?w=150",
    featured: true,
    projectId: null,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "CTO, InnovateCorp",
    company: "InnovateCorp",
    text: "Professional, creative, and delivered exactly what we needed. The communication throughout the project was excellent.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    featured: true,
    projectId: null,
    createdAt: new Date('2024-02-20')
  },
  {
    id: 3,
    name: "Elena Vasquez",
    role: "Founder, DesignHub",
    company: "DesignHub",
    text: "The most impressive development team we've worked with. They turned our vision into reality with stunning results.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    featured: true,
    projectId: null,
    createdAt: new Date('2024-03-10')
  },
  {
    id: 4,
    name: "David Park",
    role: "Marketing Director",
    company: "Growth Solutions",
    text: "Outstanding work on our e-commerce platform. Sales increased by 150% after the redesign.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    featured: false,
    projectId: 2,
    createdAt: new Date('2024-04-05')
  },
  {
    id: 5,
    name: "Jennifer Liu",
    role: "Product Manager",
    company: "DataFlow Systems",
    text: "The analytics dashboard they built has revolutionized how we understand our data. Incredible work!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    featured: false,
    projectId: 1,
    createdAt: new Date('2024-04-22')
  }
];

// @route   GET /api/testimonials
// @desc    Get all testimonials with optional filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { featured, rating, limit = 10, page = 1 } = req.query;
    
    let filteredTestimonials = [...testimonials];
    
    // Apply filters
    if (featured !== undefined) {
      filteredTestimonials = filteredTestimonials.filter(t => t.featured === (featured === 'true'));
    }
    
    if (rating) {
      filteredTestimonials = filteredTestimonials.filter(t => t.rating >= parseInt(rating));
    }
    
    // Sort by creation date (newest first)
    filteredTestimonials.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Apply pagination
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedTestimonials = filteredTestimonials.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      count: paginatedTestimonials.length,
      total: filteredTestimonials.length,
      page: pageNum,
      pages: Math.ceil(filteredTestimonials.length / limitNum),
      data: paginatedTestimonials
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching testimonials');
    if (Sentry) Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching testimonials'
    });
  }
});

// @route   GET /api/testimonials/featured
// @desc    Get featured testimonials
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const featuredTestimonials = testimonials
      .filter(t => t.featured)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      success: true,
      count: featuredTestimonials.length,
      data: featuredTestimonials
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching featured testimonials');
    if (Sentry) Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured testimonials'
    });
  }
});

// @route   GET /api/testimonials/:id
// @desc    Get single testimonial by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const testimonial = testimonials.find(t => t.id === parseInt(req.params.id));
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    
    res.json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching testimonial');
    if (Sentry) Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching testimonial'
    });
  }
});

// @route   POST /api/testimonials
// @desc    Create new testimonial (admin only in real app)
// @access  Private
router.post('/', [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name is required and must be less than 100 characters'),
  body('role')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Role is required and must be less than 100 characters'),
  body('company')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Company is required and must be less than 100 characters'),
  body('text')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Testimonial text must be between 10 and 500 characters'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const newTestimonial = {
      id: Math.max(...testimonials.map(t => t.id)) + 1,
      ...req.body,
      featured: req.body.featured || false,
      createdAt: new Date()
    };

    testimonials.push(newTestimonial);

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: newTestimonial
    });
  } catch (error) {
    logger.error({ err: error }, 'Error creating testimonial');
    if (Sentry) Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating testimonial'
    });
  }
});

// @route   GET /api/testimonials/stats/summary
// @desc    Get testimonial statistics
// @access  Public
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = {
      total: testimonials.length,
      featured: testimonials.filter(t => t.featured).length,
      averageRating: testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length,
      ratingsBreakdown: {
        5: testimonials.filter(t => t.rating === 5).length,
        4: testimonials.filter(t => t.rating === 4).length,
        3: testimonials.filter(t => t.rating === 3).length,
        2: testimonials.filter(t => t.rating === 2).length,
        1: testimonials.filter(t => t.rating === 1).length
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching testimonial stats');
    if (Sentry) Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching testimonial statistics'
    });
  }
});

// @route   GET /api/testimonials/project/:projectId
// @desc    Get testimonials for a specific project
// @access  Public
router.get('/project/:projectId', async (req, res) => {
  try {
    const projectTestimonials = testimonials.filter(t => 
      t.projectId === parseInt(req.params.projectId)
    );

    res.json({
      success: true,
      count: projectTestimonials.length,
      data: projectTestimonials
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching project testimonials');
    if (Sentry) Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching project testimonials'
    });
  }
});

module.exports = router;