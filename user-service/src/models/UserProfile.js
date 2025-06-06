const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const userProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  displayName: { type: String },
  bio: { type: String },
  avatarUrl: { type: String },
  followers: [{ type: ObjectId, ref: 'UserProfile' }],
  following: [{ type: ObjectId, ref: 'UserProfile' }]
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema);
