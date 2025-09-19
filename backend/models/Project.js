const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  technologies: [{
    type: String,
    required: true
  }],
  techStack: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: [true, 'Project image is required']
  },
  liveUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL'
    }
  },
  githubUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL'
    }
  },
  status: {
    type: String,
    enum: ['Live', 'In Progress', 'Completed', 'Archived'],
    default: 'In Progress'
  },
  featured: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['Web Development', 'Mobile App', 'E-commerce', 'Dashboard', 'Landing Page', 'Other'],
    default: 'Web Development'
  },
  clientName: {
    type: String,
    trim: true
  },
  completedAt: {
    type: Date
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
ProjectSchema.index({ featured: 1, createdAt: -1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ category: 1 });

// Virtual for tech display
ProjectSchema.virtual('techDisplay').get(function() {
  return this.technologies.join(', ');
});

// Static method to get featured projects
ProjectSchema.statics.getFeatured = function() {
  return this.find({ featured: true }).sort({ sortOrder: 1, createdAt: -1 });
};

// Static method to get projects by status
ProjectSchema.statics.getByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Project', ProjectSchema);