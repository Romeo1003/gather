import express from "express";
import { signup, login, logout, verifyToken, createAdmin, deleteAccount } from "../controllers/authController.js";
import { validateSignup, validateLogin } from "../validations/authValidation.js";
import { verifyToken as authVerify, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.get("/verify", verifyToken);

// Public admin signup endpoint with secret code
router.post("/admin-signup", validateSignup, createAdmin);

// Protected admin creation route (existing admin creating new admin)
router.post("/create-admin", authVerify, isAdmin, validateSignup, createAdmin);

// Protected delete account route
router.delete("/delete-account", authVerify, deleteAccount);

export default router;
