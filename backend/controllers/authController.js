import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validationResult } from "express-validator";

const generateToken = (user) => {
	
	return jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
		expiresIn: "8h",
	});
};


// Login Controller
export const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(400).json({ message: "Invalid email or password." });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(400).json({ message: "Invalid email or password." });
		}

		const token = generateToken(user);

		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 3600000,
		});

		res.status(200).json({ message: "Login successful!", token });
	} catch (error) {
		res.status(500).json({ message: "Login failed!", error: error.message });
	}
};


// Signup Controller
export const signup = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, email, password } = req.body;

	try {
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ message: "Email already in use." });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		const token = generateToken(newUser);

		res.status(201).json({ message: "User registered successfully!", token });
	} catch (error) {
		res.status(500).json({ message: "Signup failed!", error: error.message });
	}
};


// Add this to your authController.js
// Add this verify endpoint
export const verifyToken = async (req, res) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			return res.status(401).json({ valid: false });
		}

		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				return res.status(401).json({ valid: false });
			}
			res.status(200).json({ valid: true, user: decoded });
		});
	} catch (error) {
		res.status(500).json({ message: "Token verification failed", error: error.message });
	}
};


// Logout Controller
export const logout = (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ message: "Logged out successfully!" });
};
