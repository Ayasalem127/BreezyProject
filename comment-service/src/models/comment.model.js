const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  parentId: { type: String, default: null },
  likes: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);
