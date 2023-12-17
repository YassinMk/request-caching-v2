// routes/getUsersFromRedis.js
const express = require("express");
const redis = require("redis");
const util = require("util");

const router = express.Router();

const client = redis.createClient();

// Promisify Redis get operation
const getAsync = util.promisify(client.get).bind(client);

// Route handler for fetching users from Redis
router.get("/users-cach", async (req, res) => {
  try {
    const cachedUsers = await getAsync("cached_users");

    if (cachedUsers) {
      console.log("Users retrieved from Redis");
      res.json(JSON.parse(cachedUsers));
    } else {
      console.log("Users not found in Redis");
      res.status(404).json({ error: "Users not found" });
    }
  } catch (error) {
    console.error("Error fetching users from Redis:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
