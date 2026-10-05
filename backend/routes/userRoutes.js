const express = require("express");
const { body } = require("express-validator");
const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters"),
];

router.post("/register", registerValidation, registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

module.exports = router;