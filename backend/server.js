require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const Post = require("./models/Post");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { message: "Too many requests from this IP, please try again later." },
});
app.use(limiter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log(`⚡ Reviewer connected via WebSocket: ${socket.id}`);

  socket.on("joinReviewRoom", (postId) => {
    socket.join(postId);
    console.log(`Socket ${socket.id} joined review room for post: ${postId}`);
  });

  socket.on("sendReviewMessage", (data) => {
    if (data.postId) {
      io.to(data.postId).emit("receiveReviewMessage", data);
    } else {
      io.emit("receiveReviewMessage", data);
    }
  });

  socket.on("chatMessage", (data) => {
    io.emit("chatMessage", data);
    io.emit("receiveReviewMessage", data);
  });

  socket.on("disconnect", () => {
    console.log(`Reviewer disconnected: ${socket.id}`);
  });
});

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/devreview_db";

let isDbConnected = false;

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    isDbConnected = true;
    console.log("✅ MongoDB Connected successfully!");

    try {
      const count = await Post.countDocuments();
      if (count === 0) {
        await seedSamplePosts();
      }
    } catch (e) {
      console.log("Seed check skipped:", e.message);
    }

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

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "DevRev REST API Server & Real-Time WebSocket is running",
    database: isDbConnected ? "MongoDB Connected" : "Connecting",
    websocket: "Socket.IO Active",
    version: "1.0.0",
    endpoints: {
      posts: "/api/posts",
      users: "/api/users",
    },
  });
});

app.use((err, req, res, next) => {
  console.error("Centralized Error Handler:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 DevRev Backend Server & WebSocket running on http://localhost:${PORT}`);
});