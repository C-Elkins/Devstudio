const mongoose = require('mongoose');

// Generate a short, user-friendly random code (6 chars, uppercase alphanumeric)
function generateShortCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No 0/O/1/I for clarity
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const InviteTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true, default: () => generateShortCode() },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  createdByIp: { type: String },
  createdByUserAgent: { type: String },
  used: { type: Boolean, default: false },
  redeemedByIp: { type: String },
  redeemedByUserAgent: { type: String },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});


InviteTokenSchema.statics.createToken = async function(createdById, ttlHours = 24) {
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
  let tokenStr, existing;
  // Ensure uniqueness (very unlikely collision)
  do {
    tokenStr = generateShortCode();
    existing = await this.findOne({ token: tokenStr });
  } while (existing);
  const token = await this.create({ token: tokenStr, createdBy: createdById, expiresAt });
  return token;
};

module.exports = mongoose.model('InviteToken', InviteTokenSchema);
