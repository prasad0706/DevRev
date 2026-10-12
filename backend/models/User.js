const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
<<<<<<< HEAD
    username: {
      type: String,
      trim: true,
      lowercase: true,
    },
=======

>>>>>>> 8e15754e525f4eb53619fbe81c6d603fed142b61
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
<<<<<<< HEAD
    karma: {
      type: Number,
      default: 100,
=======

    karma: {
      type: Number,
      default: 0,
>>>>>>> 8e15754e525f4eb53619fbe81c6d603fed142b61
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);