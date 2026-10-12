const jwt = require("jsonwebtoken");

const getSecret = () => process.env.JWT_SECRET || "devrev_fallback_secret_key";

/**
 * Authentication Middleware (EXP NO. 5 & 6)
 * Verifies the JWT Bearer token sent in the Authorization header.
 */
const protect = (req, res, next) => {
  try {
<<<<<<< HEAD
    const decoded = jwt.verify(token, getSecret());
    req.user = decoded; // Attaches payload: { id, role, name, email }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

/**
 * Role-Based Authorization Middleware (EXP NO. 6)
 * Only allows users whose JWT payload contains role === 'admin'.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Forbidden: Admin privileges required to perform this action.",
    });
  }
};

module.exports = { protect, adminOnly };
=======
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};

module.exports = {
  protect,
  requireAdmin,
};
>>>>>>> 8e15754e525f4eb53619fbe81c6d603fed142b61
