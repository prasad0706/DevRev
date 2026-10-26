const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  registerUser,
  loginUser,
  getProfile,
  getAdminData,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Validation middleware for registration (EXP NO. 5)
const registerValidation = [
  body("name")
    .optional()
    .trim(),
  body("username")
    .optional()
    .trim(),
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters"),
  body().custom((value) => {
    if (!value.name && !value.username) {
      throw new Error("Name or username is required");
    }
    return true;
  }),
];

// 1. User Registration (Public)
router.post("/register", registerValidation, registerUser);

// 2. User Login (Public)
router.post("/login", loginUser);

// 3. User Profile (Protected with JWT - EXP NO. 5)
router.get("/profile", protect, getProfile);

// 4. Admin Dashboard (Protected with JWT + Admin Role - EXP NO. 6)
router.get("/admin-dashboard", protect, adminOnly, getAdminData);

module.exports = router;