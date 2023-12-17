const axios = require("axios");
const mongoose = require("mongoose");
const connectToDatabase = require("./services/db");
const User = require("./models/user");
const Post = require("./models/post");
const redis = require("redis");
const util = require("util");

const client = redis.createClient();

// Promisify Redis set operation
const setAsync = util.promisify(client.set).bind(client);
const getAsync = util.promisify(client.get).bind(client);

async function seedDatabase() {
    try {
      await connectToDatabase();
    const usersCount = await User.countDocuments();
    const postsCount = await Post.countDocuments();

    if (usersCount > 0 && postsCount > 0) {
      console.log("Data already exists in MongoDB.");

      // Check if data is cached in Redis
      const cachedUsers = await getAsync("cached_users");
      const cachedPosts = await getAsync("cached_posts");

      if (cachedUsers && cachedPosts) {
        console.log("Data already cached in Redis. Skipping insertion.");
        return;
      }
    }

      
      // Fetch users, posts, and comments from the JSONPlaceholder API
      const usersResponse = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      const postsResponse = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const commentsResponse = await axios.get(
        "https://jsonplaceholder.typicode.com/comments"
      );
  
      const users = usersResponse.data;
      const posts = postsResponse.data;
      const comments = commentsResponse.data;
  
      // Store users in MongoDB
      await User.insertMany(users);
  
      // Map comments to posts based on postId
      const postsWithComments = posts.map((post) => {
        const postComments = comments.filter(
          (comment) => comment.postId === post.id
        );
        return { ...post, comments: postComments };
      });
  
      // Store posts with comments in MongoDB
      const insertedPosts = await Post.insertMany(postsWithComments);
  
      console.log("Data seeded successfully!");
  
      // Cache users and posts data in Redis after MongoDB insertion
      await setAsync("cached_users", JSON.stringify(users));
      await setAsync("cached_posts", JSON.stringify(insertedPosts));
  
      console.log("Data cached in Redis");
    } catch (error) {
      console.error("Error seeding data:", error);
    } finally {
      // Close the MongoDB connection
      mongoose.disconnect();
  
      // Close the Redis connection
      client.quit();
    }
  }
  
  // Run the seed function
module.exports= {seedDatabase};