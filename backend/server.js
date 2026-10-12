require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const Post = require("./models/Post");

const app = express();

// ==========================================
// 1. SECURITY & UTILITY MIDDLEWARES (EXP NO. 5)
// ==========================================
app.use(helmet()); // Secure HTTP headers
app.use(cors()); // Enable Cross-Origin Resource Sharing for React Frontend
app.use(express.json()); // Parse JSON request bodies

// Rate Limiter: Protects against Denial-of-Service (DoS) and brute-force (EXP NO. 5)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 300, // Limit each IP to 300 requests per 15 minutes
  message: { message: "Too many requests from this IP, please try again later." },
});
app.use(limiter);

// ==========================================
// 2. DATABASE CONNECTION (EXP NO. 4)
// ==========================================
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/devreview_db";

let isDbConnected = false;

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    isDbConnected = true;
    console.log("✅ MongoDB Connected successfully!");
    // Seed initial posts if database is empty
    try {
      const count = await Post.countDocuments();
      if (count === 0) {
        await seedSamplePosts();
      }
    } catch (e) {
      console.log("Seed check skipped:", e.message);
    }

    // Ensure legacy non-sparse index on username is cleaned up
    try {
      const userIndexes = await mongoose.connection.db.collection("users").indexes();
      const legacyUsernameIndex = userIndexes.find(
        (idx) => idx.name === "username_1" && !idx.sparse
      );
      if (legacyUsernameIndex) {
        await mongoose.connection.db.collection("users").dropIndex("username_1");
        console.log("🧹 Cleaned up legacy username index from MongoDB.");
      }
    } catch (e) {}
  })
  .catch((err) => {
    console.error("⚠️ MongoDB Atlas Connection Note:", err.message);
    console.log(
      "👉 If using MongoDB Atlas, remember to add 0.0.0.0/0 to Network Access in Atlas."
    );
  });

// Seed data function to provide realistic code snippets for peer review
async function seedSamplePosts() {
  const initialPosts = [
    {
      title: "Is this custom React hook causing memory leaks or unnecessary re-renders?",
      code: `const useFetchData = (url) => {\n  const [data, setData] = useState(null);\n  useEffect(() => {\n    let isMounted = true;\n    fetch(url)\n      .then(res => res.json())\n      .then(result => { if (isMounted) setData(result); });\n    return () => { isMounted = false; };\n  }, [url]);\n  return data;\n};`,
      language: "javascript",
      author: "alex_dev",
      tags: ["react", "performance"],
      upvotes: 42,
      comments: [
        {
          author: "sarah_backend",
          text: "Good catch with isMounted! Consider using AbortController to cancel network requests in flight.",
          line: 5,
          diff: "const controller = new AbortController();\nfetch(url, { signal: controller.signal });",
          isAccepted: true,
        },
      ],
    },
    {
      title: "Review my MongoDB aggregation pipeline for dynamic category filtering",
      code: `await db.collection('posts').aggregate([\n  { $match: { status: 'open' } },\n  { $group: { _id: '$tags', total: { $sum: 1 } } },\n  { $sort: { total: -1 } }\n]);`,
      language: "javascript",
      author: "sarah_backend",
      tags: ["mongodb", "express"],
      upvotes: 27,
      comments: [],
    },
    {
      title: "Is this JWT bearer token validation logic susceptible to timing attacks?",
      code: `const verifyToken = (req, res, next) => {\n  const token = req.headers['authorization'];\n  if (!token) return res.status(401).json({ error: 'Missing token' });\n  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {\n    if (err) return res.status(403).json({ error: 'Invalid token' });\n    req.user = user;\n    next();\n  });\n};`,
      language: "javascript",
      author: "michael_sec",
      tags: ["security", "express"],
      upvotes: 65,
      comments: [],
    },
  ];
  await Post.insertMany(initialPosts);
  console.log("🌱 Seeded initial peer review code snippets into MongoDB!");
}

// ==========================================
// 3. API ROUTES (EXP NO. 4, 5 & 6)
// ==========================================
app.use("/api/users", userRoutes); // EXP 5 & 6: Auth, Validation, JWT, RBAC
app.use("/api/posts", postRoutes); // EXP 4: Full CRUD REST APIs

// Root Health Check Route
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "DevRev REST API Server is running",
    database: isDbConnected ? "MongoDB Connected" : "Connecting",
    version: "1.0.0",
    endpoints: {
      posts: "/api/posts",
      users: "/api/users",
    },
  });
});

// Centralized Error Handling Middleware (EXP NO. 5)
app.use((err, req, res, next) => {
  console.error("Centralized Error Handler:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 DevRev Backend Server running on http://localhost:${PORT}`);
});