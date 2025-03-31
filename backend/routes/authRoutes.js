import express from "express";
import { signup, login, logout, verifyToken } from "../controllers/authController.js";
import { validateSignup, validateLogin } from "../validations/authValidation.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.get("/verify", verifyToken); // Add this new route


export default router;
