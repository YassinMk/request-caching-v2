const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: String,
    id: Number,
    name: String,
    phone: String,
    username: String,
    website: String,
    address: {
      city: String,
      geo: {
        lat: String,
        lng: String,
      },
      street: String,
      suite: String,
      zipcode: String,
    },
    company: {
      bs: String,
      catchPhrase: String,
      name: String,
    },
  })

const User = mongoose.model("User", userSchema);

module.exports = User;