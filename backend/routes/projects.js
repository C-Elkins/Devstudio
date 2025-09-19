const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const { logger } = require('../logger');
let Sentry;
try { Sentry = require('@sentry/node'); } catch (_) { Sentry = null; }

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects with optional filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, category, featured, limit = 10, page = 1 } = req.query;
    
    // Build query object
    let query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (featured !== undefined) query.featured = featured === 'true';
    
    // Calculate pagination
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;
    
    // Execute query with pagination
    const projects = await Project.find(query)
      .sort({ featured: -1, sortOrder: 1, createdAt: -1 })
      .limit(limitNum)
      .skip(skip)
      .select('-__v');
    
    // Get total count for pagination
    const total = await Project.countDocuments(query);
    
    res.json({
      success: true,
      count: projects.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: projects
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching projects');
    if (Sentry) Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching projects'
    });
  }
});

// @route   GET /api/projects/featured
// @desc    Get featured projects
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const projects = await Project.getFeatured();
    
    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching featured projects');
    if (Sentry) Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured projects'
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).select('-__v');
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching project');
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    if (Sentry) Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching project'
    });
  }
});

// @route   POST /api/projects
// @desc    Create new project (admin only - add auth middleware in real app)
// @access  Private
router.post('/', [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title is required and must be less than 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description is required and must be less than 500 characters'),
  body('technologies')
    .isArray({ min: 1 })
    .withMessage('At least one technology is required'),
  body('image')
    .isURL()
    .withMessage('Valid image URL is required'),
  body('status')
    .optional()
    .isIn(['Live', 'In Progress', 'Completed', 'Archived'])
    .withMessage('Invalid status')
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
    
    const project = new Project(req.body);
    await project.save();
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    logger.error({ err: error }, 'Error creating project');
    if (Sentry) Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating project'
    });
  }
});

// @route   GET /api/projects/stats/summary
// @desc    Get project statistics
// @access  Public
router.get('/stats/summary', async (req, res) => {
  try {
    const [totalProjects, liveProjects, completedProjects] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: 'Live' }),
      Project.countDocuments({ status: 'Completed' })
    ]);
    
    res.json({
      success: true,
      data: {
        total: totalProjects,
        live: liveProjects,
        completed: completedProjects,
        inProgress: await Project.countDocuments({ status: 'In Progress' })
      }
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching project stats');
    if (Sentry) Sentry.captureException(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching project statistics'
    });
  }
});

module.exports = router;