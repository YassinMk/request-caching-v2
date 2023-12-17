const express = require("express");
const { seedDatabase } = require("./seeds");
const app = express();

app.use(express.static("static"))

// Import route handlers
seedDatabase();

const getUsersFromRedisRouter = require("./routes/usersRedis");
const getUsersFromMongoDBRouter = require("./routes/usersMongoDb");

// Use route handlers
app.use("/", getUsersFromRedisRouter);
app.use("/", getUsersFromMongoDBRouter);
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});