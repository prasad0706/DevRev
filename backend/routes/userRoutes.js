// const express = require("express");
// const { body } = require("express-validator");
// const {
//   registerUser,
//   loginUser,
//   getProfile,
// } = require("../controllers/userController");
// const protect = require("../middleware/authMiddleware");

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

module.exports = router;