import { responseHandler } from '../utils/responseHandler.js';
import { logger } from '../utils/logger.js';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { validationResult } from 'express-validator';
import { generateToken } from '../utils/jwt.js';
import { codeValidator } from '../utils/codeValidator.js';

// Login Controller
export const login = async (req, res) => {
	const { email, password } = req.body;
	const normalizedEmail = email.toLowerCase();

	try {
		const user = await User.findOne({ where: { email: normalizedEmail } });

		if (!user) {
			return res.status(400).json({ message: "Invalid email or password." });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(400).json({ message: "Invalid email or password." });
		}

		// Generate token and respond
		const token = generateToken(user);
		return res.json(responseHandler.success({ token, role: user.role }, 'Login successful'));
	} catch (error) {
		return res.status(500).json(responseHandler.serverError('Login failed', error));
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

	// Auto-validate code changes if present
	if (req.body.codeChanges) {
		const validationResult = codeValidator.autoAcceptChanges(req.body.codeChanges);
		if (!validationResult.accepted) {
			return res.status(400).json(responseHandler.error(validationResult.message, validationResult.error));
		}
	}

	const { name, email, password, role } = req.body;
	const normalizedEmail = email.toLowerCase();
	console.log("Processing signup for:", normalizedEmail);

	try {
		// Check if the user is trying to create an admin account without going through the admin signup process
		if (role === 'admin') { // Only check explicit role assignment
			return res.status(400).json({ message: "Admin accounts must be created through the admin signup process." });
		}

		await authModule.validateNewUser(email);

		const hashedPassword = await bcrypt.hash(password, 10);
		console.log("Password hashed successfully");

		const newUser = await authModule.handleDatabaseTransaction(async (transaction) => {
			return await User.create({
				name,
				email: normalizedEmail,
				password: hashedPassword,
				role: "customer"
			}, { transaction });
		});
		console.log("User created successfully:", newUser.email);

		const token = generateToken(newUser);
		console.log("Token generated successfully");

		res.status(201).json({ 
			message: "User registered successfully!", 
			token,
			role: newUser.role
		});
	} catch (error) {
		console.error("Error in signup:", error);
		await authModule.rollbackTransaction(transaction);
		throw responseHandler.serverError('Signup failed', error);
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

	// Force the email to use admin.com domain if it doesn't already
	let adminEmail = email;
	if (!adminEmail.endsWith('@admin.com')) {
		// If the email doesn't already have the domain, append it
		// First, extract the username part (everything before @)
		const emailParts = adminEmail.split('@');
		const username = emailParts[0];
		adminEmail = `${username}@admin.com`;
		console.log(`Converted email to admin domain: ${adminEmail}`);
	}

	// Always verify admin code/PIN for admin signup
	// Get the valid PIN from environment variable with a fallback
	const validAdminPin = process.env.ADMIN_SECRET_PIN || '123456';
	
	if (!adminCode || adminCode !== validAdminPin) {
		console.log("Invalid admin PIN provided");
		return res.status(401).json({ message: "Invalid administrator PIN" });
	}

	try {
		const existingUser = await User.findOne({ where: { email: adminEmail } });
		if (existingUser) {
			console.log("Email already in use:", adminEmail);
			return res.status(400).json({ message: "Email already in use." });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		console.log("Password hashed successfully");

		const newAdmin = await User.create({
			name,
			email: adminEmail,
			password: hashedPassword,
			role: "admin" // Set role as admin
		});
		console.log("Admin created successfully:", newAdmin.email);

		const token = generateToken(newAdmin);
		console.log("Token generated successfully");

		res.status(201).json({ 
			message: "Admin registered successfully!", 
			token,
			role: newAdmin.role 
		});
	} catch (error) {
		console.error("Error in admin creation:", error);
		res.status(500).json({ message: "Admin registration failed!", error: error.message });
	}
};

// Delete Account
export const deleteAccount = async (req, res) => {
	try {
		const { password } = req.body;
		const userId = req.user.id;
		
		// Find the user
		const user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		
		// Verify password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid password" });
		}
		
		// Delete the user
		await user.destroy();
		
		// Clear authentication
		res.clearCookie('token');
		
		res.status(200).json({ message: "Account deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Failed to delete account", error: error.message });
	}
};
