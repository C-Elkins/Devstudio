import { Schema, model } from 'mongoose';
import { compare, genSalt, hash as _hash } from 'bcryptjs';

const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  email: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

AdminSchema.methods.verifyPassword = function(password) {
  return compare(password, this.passwordHash);
};

AdminSchema.statics.createAdmin = async function(username, password, email) {
  const salt = await genSalt(10);
  const hash = await _hash(password, salt);
  return this.create({ username, passwordHash: hash, email });
};

export default model('Admin', AdminSchema);
