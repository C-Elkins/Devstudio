
const { Schema, model } = require('mongoose');
const { compare, genSalt, hash } = require('bcryptjs');

const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  email: { type: String, trim: true },
  role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
  twoFAEnabled: { type: Boolean, default: false },
  twoFASecret: { type: String },
  createdAt: { type: Date, default: Date.now }
});

AdminSchema.methods.verifyPassword = function(password) {
  return compare(password, this.passwordHash);
};


AdminSchema.statics.createAdmin = async function(username, password, email) {
  const salt = await genSalt(10);
  const passwordHash = await hash(password, salt);
  return this.create({ username, passwordHash, email });
};

module.exports = model('Admin', AdminSchema);
