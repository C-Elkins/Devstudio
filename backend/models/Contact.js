const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^[\+]?[1-9][\d]{0,15}$/.test(v);
      },
      message: 'Please provide a valid phone number'
    }
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  projectType: {
    type: String,
    enum: ['Web Development', 'Mobile App', 'E-commerce', 'Consulting', 'Design', 'Other'],
    default: 'Other'
  },
  budget: {
    type: String,
    enum: ['Under $5K', '$5K - $15K', '$15K - $50K', '$50K+', 'Not Sure'],
    default: 'Not Sure'
  },
  timeline: {
    type: String,
    enum: ['ASAP', '1-3 months', '3-6 months', '6+ months', 'Flexible'],
    default: 'Flexible'
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'In Discussion', 'Quoted', 'Closed', 'Archived'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  source: {
    type: String,
    enum: ['Website', 'Referral', 'Social Media', 'Search Engine', 'Direct', 'Other'],
    default: 'Website'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  followUpDate: {
    type: Date
  },
  responded: {
    type: Boolean,
    default: false
  },
  respondedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
ContactSchema.index({ status: 1, createdAt: -1 });
ContactSchema.index({ email: 1 });
ContactSchema.index({ priority: 1, status: 1 });
ContactSchema.index({ responded: 1 });

// Static method to get unresponded contacts
ContactSchema.statics.getUnresponded = function() {
  return this.find({ responded: false }).sort({ priority: 1, createdAt: 1 });
};

// Static method to get contacts by status
ContactSchema.statics.getByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Method to mark as responded
ContactSchema.methods.markAsResponded = function() {
  this.responded = true;
  this.respondedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Contact', ContactSchema);