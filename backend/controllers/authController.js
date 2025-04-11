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
	const { email, password, adminPin } = req.body;

	try {
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(400).json({ message: "Invalid email or password." });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(400).json({ message: "Invalid email or password." });
		}
		
		// If this is an admin user, verify the admin PIN
		if (user.role === "admin") {
			// If admin PIN is missing
			if (!adminPin) {
				return res.status(400).json({ message: "Admin PIN is required for administrator login." });
			}
			
			// Get the valid PIN from environment variable with a fallback
			const validAdminPin = process.env.ADMIN_SECRET_PIN || '123456';
			
			// Check if provided PIN matches
			if (adminPin !== validAdminPin) {
				return res.status(401).json({ message: "Invalid administrator PIN." });
			}
		}

		const token = generateToken(user);

		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 3600000,
		});

		res.status(200).json({ 
			message: "Login successful!", 
			token,
			role: user.role 
		});
	} catch (error) {
		res.status(500).json({ message: "Login failed!", error: error.message });
	}
};


// Signup Controller
export const signup = async (req, res) => {
	console.log("Signup request received:", req.body);
	
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("Validation errors:", errors.array());
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, email, password } = req.body;
	console.log("Processing signup for:", email);

	try {
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			console.log("Email already in use:", email);
			return res.status(400).json({ message: "Email already in use." });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		console.log("Password hashed successfully");

		const newUser = await User.create({
			name,
			email,
			password: hashedPassword,
		});
		console.log("User created successfully:", newUser.email);

		const token = generateToken(newUser);
		console.log("Token generated successfully");

		res.status(201).json({ message: "User registered successfully!", token });
	} catch (error) {
		console.error("Error in signup:", error);
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

		jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
			if (err) {
				return res.status(401).json({ valid: false });
			}
			
			// Get user from database to include role information
			try {
				const user = await User.findOne({ where: { email: decoded.email } });
				if (!user) {
					return res.status(401).json({ valid: false });
				}
				
				res.status(200).json({ 
					valid: true, 
					user: {
						...decoded,
						role: user.role
					} 
				});
			} catch (error) {
				console.error("Error finding user:", error);
				return res.status(500).json({ valid: false, message: "Database error" });
			}
		});
	} catch (error) {
		res.status(500).json({ message: "Token verification failed", error: error.message });
	}
};


// Logout Controller
export const logout = (req, res) => {
	try {
		res.clearCookie('token');
		res.status(200).json({ message: "Logout successful" });
	} catch (error) {
		res.status(500).json({ message: "Logout failed", error: error.message });
	}
};

// Create Admin
export const createAdmin = async (req, res) => {
	console.log("Admin creation request received:", req.body);
	
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("Validation errors:", errors.array());
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, email, password, adminCode } = req.body;
	console.log("Processing admin creation for:", email);

	// Always verify admin code/PIN for admin signup
	// Get the valid PIN from environment variable with a fallback
	const validAdminPin = process.env.ADMIN_SECRET_PIN || '123456';
	
	if (!adminCode || adminCode !== validAdminPin) {
		console.log("Invalid admin PIN provided");
		return res.status(401).json({ message: "Invalid administrator PIN" });
	}

	try {
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			console.log("Email already in use:", email);
			return res.status(400).json({ message: "Email already in use." });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		console.log("Password hashed successfully");

		const newAdmin = await User.create({
			name,
			email,
			password: hashedPassword,
			role: "admin" // Set role as admin
		});
		console.log("Admin created successfully:", newAdmin.email);

		const token = generateToken(newAdmin);
		console.log("Token generated successfully");

		res.status(201).json({ message: "Admin registered successfully!", token });
	} catch (error) {
		console.error("Error in admin creation:", error);
		res.status(500).json({ message: "Admin creation failed!", error: error.message });
	}
};

// Delete User Account
export const deleteAccount = async (req, res) => {
	try {
		// Get user from the token
		const token = req.headers.authorization?.split(' ')[1];
		
		if (!token) {
			return res.status(401).json({ message: "Authentication required" });
		}
		
		// Verify and decode the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		
		if (!decoded || !decoded.email) {
			return res.status(401).json({ message: "Invalid token" });
		}
		
		// Find the user in the database
		const user = await User.findOne({ where: { email: decoded.email } });
		
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		
		// Confirm password if provided in the request
		const { password } = req.body;
		if (password) {
			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (!isPasswordValid) {
				return res.status(401).json({ message: "Invalid password" });
			}
		}
		
		// Delete the user
		await User.destroy({ where: { email: decoded.email } });
		
		// Clear the auth cookie
		res.clearCookie('token');
		
		// Return success message
		res.status(200).json({ message: "Account deleted successfully" });
	} catch (error) {
		console.error("Error deleting account:", error);
		res.status(500).json({ message: "Failed to delete account", error: error.message });
	}
};
