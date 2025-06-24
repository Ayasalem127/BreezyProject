const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const userProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  displayName: { type: String },
  bio: { type: String },
   role: { 
    type: String, 
    enum: ['user', 'moderator', 'admin'], 
    default: 'user' 
  },
  avatarUrl: { type: String },
  followers: [{ type: String, ref: 'UserProfile' }],
  following: [{ type: String, ref: 'UserProfile' }],
  status: { type: String, enum: ['active', 'suspended', 'banned'], default: 'active' },
  suspendedUntil: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema);
