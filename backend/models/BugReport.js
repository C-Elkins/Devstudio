const mongoose = require('mongoose');

const bugReportSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 5000 },
  url: { type: String, trim: true },
  reporterEmail: { type: String, trim: true, lowercase: true },
  status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model('BugReport', bugReportSchema);
