const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: "Anonymous",
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: ["javascript", "web"],
    },
    comments: [
      {
        author: { type: String, default: "Anonymous" },
        text: { type: String, required: true },
        line: { type: Number, default: null },
        diff: { type: String, default: null },
        isAccepted: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);