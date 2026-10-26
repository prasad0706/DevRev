const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "devrev_fallback_secret_key";

// Initial sample posts used if MongoDB Atlas is offline / during IP whitelist setup
let inMemoryPosts = [
  {
    _id: "660000000000000000000001",
    title: "Is this custom React hook causing memory leaks or unnecessary re-renders in useEffect?",
    code: `const useFetchData = (url) => {\n  const [data, setData] = useState(null);\n  useEffect(() => {\n    let isMounted = true;\n    fetch(url)\n      .then(res => res.json())\n      .then(result => { if (isMounted) setData(result); });\n    return () => { isMounted = false; };\n  }, [url]);\n  return data;\n};`,
    language: "javascript",
    author: "alex_dev",
    tags: ["react", "performance"],
    upvotes: 42,
    comments: [
      {
        _id: "c1",
        author: "sarah_backend",
        text: "Good catch adding isMounted! Alternatively, use AbortController to cancel network requests in flight.",
        line: 5,
        diff: "const controller = new AbortController();\nfetch(url, { signal: controller.signal });",
        isAccepted: true,
        createdAt: new Date(),
      },
    ],
    createdAt: new Date(),
  },
  {
    _id: "660000000000000000000002",
    title: "Review my MongoDB aggregation pipeline for dynamic category filtering",
    code: `await db.collection('posts').aggregate([\n  { $match: { status: "open" } },\n  { $group: { _id: "$tags", total: { $sum: 1 } } },\n  { $sort: { total: -1 } }\n]);`,
    language: "javascript",
    author: "sarah_backend",
    tags: ["mongodb", "express"],
    upvotes: 27,
    comments: [],
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    _id: "660000000000000000000003",
    title: "Is this JWT bearer token validation logic susceptible to timing attacks?",
    code: `const verifyToken = (req, res, next) => {\n  const token = req.headers['authorization'];\n  if (!token) return res.status(401).json({ error: 'Missing token' });\n  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {\n    if (err) return res.status(403).json({ error: 'Invalid token' });\n    req.user = user;\n    next();\n  });\n};`,
    language: "javascript",
    author: "michael_sec",
    tags: ["security", "express"],
    upvotes: 65,
    comments: [],
    createdAt: new Date(Date.now() - 7200000),
  },
];

const isDbLive = () => mongoose.connection.readyState === 1;

// Helper middleware to optionally decode token without rejecting if absent
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      // ignore invalid token for public actions
    }
  }
  next();
};

/**
 * 1. CREATE POST (EXP NO. 4 CRUD: Create)
 * POST /api/posts
 */
router.post("/", optionalAuth, async (req, res) => {
  try {
    const { title, code, language, tags, author } = req.body;

    if (!title || !code) {
      return res.status(400).json({ message: "Title and code snippet are required" });
    }

    const postAuthor = (req.user && req.user.name) || author || "Anonymous Dev";
    const postData = {
      title,
      code,
      language: language || "javascript",
      tags: tags && tags.length > 0 ? tags : ["javascript", "web"],
      author: postAuthor,
      upvotes: 0,
      comments: [],
      createdAt: new Date(),
    };

    if (isDbLive()) {
      const post = await Post.create(postData);
      return res.status(201).json(post);
    } else {
      const newPost = { _id: String(Date.now()), ...postData };
      inMemoryPosts.unshift(newPost);
      return res.status(201).json(newPost);
    }
  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(400).json({ message: error.message });
  }
});

/**
 * 2. GET ALL POSTS (EXP NO. 4 CRUD: Read All)
 * GET /api/posts
 */
router.get("/", async (req, res) => {
  try {
    if (isDbLive()) {
      const posts = await Post.find().sort({ createdAt: -1 });
      return res.status(200).json(posts);
    } else {
      return res.status(200).json(inMemoryPosts);
    }
  } catch (error) {
    console.error("Get Posts Error:", error);
    return res.status(200).json(inMemoryPosts);
  }
});

/**
 * 3. GET POST BY ID (EXP NO. 4 CRUD: Read One)
 * GET /api/posts/:id
 */
router.get("/:id", async (req, res) => {
  try {
    if (isDbLive() && mongoose.isValidObjectId(req.params.id)) {
      const post = await Post.findById(req.params.id);
      if (post) return res.status(200).json(post);
    }
    const memPost = inMemoryPosts.find(
      (p) => p._id === req.params.id || p.id === req.params.id
    );
    if (!memPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(memPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * 4. UPDATE POST (EXP NO. 4 CRUD: Update)
 * PUT /api/posts/:id
 */
router.put("/:id", async (req, res) => {
  try {
    if (isDbLive() && mongoose.isValidObjectId(req.params.id)) {
      const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (post) return res.status(200).json(post);
    }
    const idx = inMemoryPosts.findIndex(
      (p) => p._id === req.params.id || p.id === req.params.id
    );
    if (idx === -1) {
      return res.status(404).json({ message: "Post not found" });
    }
    inMemoryPosts[idx] = { ...inMemoryPosts[idx], ...req.body };
    res.status(200).json(inMemoryPosts[idx]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * 5. UPVOTE POST (Peer review karma feature)
 * PUT /api/posts/:id/upvote
 */
router.put("/:id/upvote", async (req, res) => {
  try {
    const { delta = 1 } = req.body;
    if (isDbLive() && mongoose.isValidObjectId(req.params.id)) {
      const post = await Post.findById(req.params.id);
      if (post) {
        post.upvotes = Math.max(0, post.upvotes + Number(delta));
        await post.save();
        return res.status(200).json(post);
      }
    }
    const post = inMemoryPosts.find(
      (p) => p._id === req.params.id || p.id === req.params.id
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.upvotes = Math.max(0, (post.upvotes || 0) + Number(delta));
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * 6. ADD PEER REVIEW COMMENT (DevReview refactor suggestion)
 * POST /api/posts/:id/comments
 */
router.post("/:id/comments", optionalAuth, async (req, res) => {
  try {
    const { text, line, diff, author } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const commentAuthor = (req.user && req.user.name) || author || "Anonymous Peer";
    const newComment = {
      _id: String(Date.now()),
      author: commentAuthor,
      line: line ? Number(line) : null,
      diff: diff || null,
      isAccepted: false,
      createdAt: new Date(),
    };

    if (isDbLive() && mongoose.isValidObjectId(req.params.id)) {
      const post = await Post.findById(req.params.id);
      if (post) {
        post.comments.push(newComment);
        await post.save();
        return res.status(201).json(post);
      }
    }

    const post = inMemoryPosts.find(
      (p) => p._id === req.params.id || p.id === req.params.id
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!post.comments) post.comments = [];
    post.comments.push(newComment);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * 7. DELETE POST (EXP NO. 4 & EXP NO. 6: Protected Role Action)
 * DELETE /api/posts/:id
 * Only Admin users can delete posts!
 */
router.delete("/:id", optionalAuth, async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in first." });
    }

    // Role check: Only admin can delete (EXP 6)
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Only Admin users can delete code review posts.",
      });
    }

    if (isDbLive() && mongoose.isValidObjectId(req.params.id)) {
      const post = await Post.findByIdAndDelete(req.params.id);
      if (post) {
        return res.status(200).json({ message: "Post deleted successfully by Admin" });
      }
    }

    const initialLen = inMemoryPosts.length;
    inMemoryPosts = inMemoryPosts.filter(
      (p) => p._id !== req.params.id && p.id !== req.params.id
    );
    if (inMemoryPosts.length === initialLen) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully by Admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;