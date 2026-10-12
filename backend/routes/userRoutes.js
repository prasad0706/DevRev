<<<<<<< HEAD
const express = require("express");
const { body } = require("express-validator");
const {
  registerUser,
  loginUser,
  getProfile,
  getAdminData,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
=======
// const express = require("express");
// const { body } = require("express-validator");
// const {
//   registerUser,
//   loginUser,
//   getProfile,
// } = require("../controllers/userController");
// const protect = require("../middleware/authMiddleware");
>>>>>>> 8e15754e525f4eb53619fbe81c6d603fed142b61

// const router = express.Router();

// const registerValidation = [
//   body("name").notEmpty().withMessage("Name is required"),
//   body("email").isEmail().withMessage("Enter a valid email"),
//   body("password")
//     .isLength({ min: 6 })
//     .withMessage("Password must contain at least 6 characters"),
// ];

// router.post("/register", registerValidation, registerUser);
// router.post("/login", loginUser);
// router.get("/profile", protect, getProfile);

// module.exports = router;

const express = require("express");
const router = express.Router();

<<<<<<< HEAD
// Validation middleware for registration (EXP NO. 5)
const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters"),
];

// 1. User Registration (Public)
router.post("/register", registerValidation, registerUser);

// 2. User Login (Public)
router.post("/login", loginUser);

// 3. User Profile (Protected with JWT - EXP NO. 5)
router.get("/profile", protect, getProfile);
=======
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});
>>>>>>> 8e15754e525f4eb53619fbe81c6d603fed142b61

// 4. Admin Dashboard (Protected with JWT + Admin Role - EXP NO. 6)
router.get("/admin-dashboard", protect, adminOnly, getAdminData);

module.exports = router;