const mongoose = require('mongoose');

const BugReportSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  url: { type: String, trim: true },
  reporterEmail: { type: String, trim: true },
  status: { type: String, enum: ['New', 'Triaged', 'In Progress', 'Resolved'], default: 'New' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BugReport', BugReportSchema);
