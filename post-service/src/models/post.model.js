const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({

  content: {
    type: String,         
    required: true,       
    maxlength: 280         
  },

  author: {
    type: String,           
    required: true         
  },

  likes: {
    type: [String],          
    default: []             
  },

  createdAt: {
    type: Date,              
    default: Date.now      
  }
});


const Post = mongoose.model("Post", postSchema);

module.exports = Post;
