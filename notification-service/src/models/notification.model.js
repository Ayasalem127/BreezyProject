const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipientId: { type: String, required: true }, // utilisateur qui reçoit
  senderId: { type: String, required: true },    // utilisateur qui envoie
  type: { type: String, enum: ["like_post", "like_comment", "mention", "follow", "comment_post", "comment_reply"], required: true },
  message: { type: String },
  postId: { type: String },
  commentId: { type: String },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
