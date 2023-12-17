// routes/getUsersFromMongoDB.js
const express = require("express");
const mongoose = require("mongoose");
const connectToDatabase = require("../services/db");
const User = require("../models/user");

const router = express.Router();

// Route handler for fetching users from MongoDB
router.get("/users", async (req, res) => {
  try {
    await connectToDatabase();
    const users = await User.find().lean();

    console.log("Users retrieved from MongoDB");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users from MongoDB:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    mongoose.disconnect();
  }
});

module.exports = router;