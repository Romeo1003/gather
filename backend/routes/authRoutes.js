import express from "express";
import { body, validationResult } from "express-validator";
import { signup, login, verifyToken, logout, createAdmin, deleteAccount } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Signup route - allow users to register
router.post(
  "/signup",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  signup
);

// Admin signup route
router.post(
  "/admin-signup",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("adminCode").notEmpty().withMessage("Admin authentication PIN is required"),
  ],
  createAdmin
);

// Login route
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

// Verify token route
router.get("/verify", verifyToken);

// Logout route
router.post("/logout", logout);

// Delete account route (protected)
router.delete("/delete-account", authMiddleware, deleteAccount);

export default router;
