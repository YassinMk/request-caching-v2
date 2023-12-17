const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    body: String,
    email: String,
    id: Number,
    name: String,
    postId: Number,
});
  
const postSchema = new mongoose.Schema({
    body: String,
    id: Number,
    title: String,
    userId: Number,
    comments: [commentSchema], // Array of comments
  });
const Post = mongoose.model("Post", postSchema);
module.exports = Post;

  