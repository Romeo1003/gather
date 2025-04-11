import React, { useState, useEffect } from "react";
import {
	Box,
	Grid,
	Typography,
	TextField,
	Button,
	InputAdornment,
	IconButton,
	Tabs,
	Tab,
	Paper,
	Link,
	Checkbox,
	FormControlLabel,
	Avatar,
	Alert,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, AdminPanelSettings, Person } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import useAuth from "../hooks/useAuth";


// Styled components - now with configurable colors
const SideBanner = styled(Box)(({ theme, isAdmin }) => ({
	backgroundColor: isAdmin ? "#673ab7" : "#59BBF6", // Purple for admin, Blue for users
	height: "100vh",
	position: "relative",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	padding: theme.spacing(6),
	overflow: "hidden",
}));

const FloatingShape = styled(Box)(
	({ size = 100, top, left, right, bottom, rotate = 0, opacity = 0.2 }) => ({
		position: "absolute",
		width: size,
		height: size,
		backgroundColor: "rgba(255, 255, 255, 0.3)",
		borderRadius: "10px",
		top,
		left,
		right,
		bottom,
		transform: `rotate(${rotate}deg)`,
		filter: "blur(4px)",
		opacity,
	})
);

const FormSide = styled(Box)(({ theme }) => ({
	height: "100vh",
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	padding: theme.spacing(3),
}));

const FormContainer = styled(Box)(() => ({
	maxWidth: 400,
	width: "100%",
	margin: "0 auto",
}));

const LoginButton = styled(Button)(({ isAdmin }) => ({
	marginTop: 16,
	marginBottom: 8,
	padding: "12px 0",
	backgroundColor: isAdmin ? "#673ab7" : "#1D9BF0", // Purple for admin, Blue for users
	color: "white",
	"&:hover": {
		backgroundColor: isAdmin ? "#5e35b1" : "#0E87D3",
	},
}));

const SignInPage = ({ userType = "customer" }) => {
	const isAdmin = userType === "admin";
	const [showPassword, setShowPassword] = useState(false);
	const [showPin, setShowPin] = useState(false);
	const [tabValue, setTabValue] = useState(1);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		adminPin: "",
		rememberMe: false,
	});
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [redirectMessage, setRedirectMessage] = useState("");
	const navigate = useNavigate();
	const location = useLocation();
	const { login } = useAuth();

	// Check if user was redirected here due to session expiration
	useEffect(() => {
		// Clear any existing history manipulation handlers from logout
		if (window.onpopstate) {
			window.onpopstate = null;
		}

		// Check if we came from a protected route (via state or referrer)
		const fromProtectedRoute = location.state?.from || document.referrer;
		const protectedPaths = ['/dashboard', '/admin', '/profile', '/custdashboard'];
		
		const isProtectedRedirect = fromProtectedRoute && 
			protectedPaths.some(path => 
				typeof fromProtectedRoute === 'string' ? 
					fromProtectedRoute.includes(path) : 
					fromProtectedRoute.pathname?.includes(path)
			);
			
		if (isProtectedRedirect) {
			setRedirectMessage("Your session has expired or you have been logged out. Please sign in again.");
		}
		
		// Check if there was an unauthorized access attempt
		if (location.state?.unauthorized) {
			setRedirectMessage("You don't have permission to access that area. Please log in with appropriate credentials.");
		}
	}, [location]);

	const handleClickShowPassword = () => setShowPassword(!showPassword);
	const handleClickShowPin = () => setShowPin(!showPin);

	const handleTabChange = (_, newValue) => {
		if (isAdmin) {
			navigate(newValue === 0 ? "/admin-signup" : "/admin-signin");
		} else {
			navigate(newValue === 0 ? "/signup" : "/signin");
		}
		setTabValue(newValue);
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: "" }));
		}
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}
		if (!formData.password) {
			newErrors.password = "Password is required";
		}
		
		// Validate admin PIN if logging in as admin
		if (isAdmin && !formData.adminPin) {
			newErrors.adminPin = "Admin authentication PIN is required";
		}
		
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setIsSubmitting(true);
		try {
			// Create request data based on user type
			const requestData = {
				email: formData.email,
				password: formData.password,
			};
			
			// Add admin PIN for admin login
			if (isAdmin) {
				requestData.adminPin = formData.adminPin;
			}
			
			const { data } = await axios.post(
				"http://localhost:5001/api/auth/login",
				requestData,
				{ withCredentials: true } // Important for cookies
			);

			// Log the response to debug role information
			console.log("Login response:", data);

			// Store token in localStorage if "Remember me" is checked
			if (formData.rememberMe) {
				localStorage.setItem("token", data.token);
			}

			// Verify user role before redirecting
			const role = data.role || 'customer';
			console.log(`User logged in with role: ${role}`);

			// If admin login is expected but user role is not admin, show error
			if (isAdmin && role !== 'admin') {
				setErrors({
					general: "This account doesn't have administrator privileges",
				});
				setIsSubmitting(false);
				return;
			}

			// Call login function from AuthContext with user data
			login(data.token, {
				email: formData.email,
				role: role
			});

			// The redirect is handled in the AuthContext login function 
			// based on user role (admin → /admin, others → /dashboard/home)
		} catch (error) {
			console.error("Login error:", error);
			const errorMessage = error.response?.data?.message || "Login failed";
			setErrors({
				general: errorMessage === "Invalid email or password."
					? "Invalid credentials"
					: errorMessage,
				...(errorMessage === "Invalid email or password." && {
					email: "Invalid credentials",
					password: "Invalid credentials",
				}),
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Grid container sx={{ height: "100vh" }}>
			{/* Left side with illustrations */}
			<Grid item xs={12} md={6}>
				<SideBanner isAdmin={isAdmin}>
					{/* Floating shapes */}
					<FloatingShape size={160} top="20%" left="20%" rotate={12} />
					<FloatingShape size={80} top="30%" right="20%" rotate={-12} />
					<FloatingShape size={60} bottom="20%" left="30%" rotate={45} />
					<FloatingShape size={50} top="15%" right="15%" rotate={-12} />
					<FloatingShape size={90} bottom="15%" right="20%" rotate={12} />
					<FloatingShape size={40} top="50%" left="15%" rotate={-45} />

					{/* Content */}
					<Box sx={{ position: "relative", zIndex: 1, mt: "auto" }}>
						<Typography variant="h3" component="h1" color="white" fontWeight="bold">
							{isAdmin ? "Admin Portal" : "Welcome to Gather"}
						</Typography>
						<Typography variant="h6" color="white" sx={{ mt: 2, opacity: 0.9 }}>
							{isAdmin 
								? "Administrative access for event management and user control."
								: "Manage your events with ease and connect with attendees seamlessly."
							}
						</Typography>
					</Box>
				</SideBanner>
			</Grid>

			{/* Right side with form */}
			<Grid item xs={12} md={6}>
				<FormSide>
					<FormContainer>
						{/* Login Type Indicator */}
						<Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
							<Avatar 
								sx={{ 
									width: 60, 
									height: 60, 
									bgcolor: isAdmin ? '#673ab7' : '#1D9BF0',
									mb: 1
								}}
							>
								{isAdmin ? <AdminPanelSettings fontSize="large" /> : <Person fontSize="large" />}
							</Avatar>
						</Box>
						
						<Typography 
							variant="h5" 
							align="center" 
							fontWeight="bold"
							sx={{
								color: isAdmin ? '#673ab7' : '#1D9BF0',
								mb: 3
							}}
						>
							{isAdmin ? "Administrator Login" : "User Login"}
						</Typography>
						
						{redirectMessage && (
							<Alert severity="info" sx={{ mb: 2 }}>
								{redirectMessage}
							</Alert>
						)}

						{/* Tabs */}
						<Paper elevation={0} sx={{ mb: 4 }}>
							<Tabs
								value={tabValue}
								onChange={handleTabChange}
								variant="fullWidth"
								indicatorColor={isAdmin ? "secondary" : "primary"}
								textColor={isAdmin ? "secondary" : "primary"}
							>
								<Tab 
									label={isAdmin ? "Admin Sign Up" : "Sign Up"} 
									sx={{ 
										color: isAdmin ? '#673ab7' : '#1D9BF0',
									}}
								/>
								<Tab 
									label={isAdmin ? "Admin Sign In" : "Sign In"} 
									sx={{ 
										color: isAdmin ? '#673ab7' : '#1D9BF0',
									}}
								/>
							</Tabs>
						</Paper>

						{/* Form fields */}
						<Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
							{errors.general && (
								<Typography color="error" sx={{ mb: 2 }}>
									{errors.general}
								</Typography>
							)}

							<Typography variant="subtitle1" sx={{ mb: 1 }}>
								Email address
							</Typography>
							<TextField
								required
								fullWidth
								id="email"
								name="email"
								autoComplete="email"
								placeholder="Enter your email"
								value={formData.email}
								onChange={handleChange}
								error={!!errors.email}
								helperText={errors.email}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Email />
										</InputAdornment>
									),
								}}
								sx={{ mb: 3 }}
							/>

							<Typography variant="subtitle1" sx={{ mb: 1 }}>
								Password
							</Typography>
							<TextField
								required
								fullWidth
								name="password"
								type={showPassword ? "text" : "password"}
								id="password"
								autoComplete="current-password"
								placeholder="Enter your password"
								value={formData.password}
								onChange={handleChange}
								error={!!errors.password}
								helperText={errors.password}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Lock />
										</InputAdornment>
									),
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword}
												edge="end"
											>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									),
								}}
								sx={{ mb: isAdmin ? 3 : 2 }}
							/>

							{/* Admin PIN field - only shown for admin login */}
							{isAdmin && (
								<>
									<Typography variant="subtitle1" sx={{ mb: 1 }}>
										Admin Authentication PIN
									</Typography>
									<TextField
										required
										fullWidth
										name="adminPin"
										type={showPin ? "text" : "password"}
										id="adminPin"
										placeholder="Enter administrator PIN"
										value={formData.adminPin}
										onChange={handleChange}
										error={!!errors.adminPin}
										helperText={errors.adminPin || "Required for admin access"}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<AdminPanelSettings />
												</InputAdornment>
											),
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														aria-label="toggle pin visibility"
														onClick={handleClickShowPin}
														edge="end"
													>
														{showPin ? <VisibilityOff /> : <Visibility />}
													</IconButton>
												</InputAdornment>
											),
										}}
										sx={{ mb: 2 }}
									/>
								</>
							)}

							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									mb: 3,
								}}
							>
								<FormControlLabel
									control={
										<Checkbox
											color={isAdmin ? "secondary" : "primary"}
											name="rememberMe"
											checked={formData.rememberMe}
											onChange={handleChange}
										/>
									}
									label="Remember me"
								/>

								<Link
									href="#"
									onClick={(e) => {
										e.preventDefault();
										navigate("/forgot-password");
									}}
									sx={{ color: isAdmin ? "#673ab7" : "#1D9BF0" }}
								>
									Forgot password?
								</Link>
							</Box>

							<LoginButton
								type="submit"
								fullWidth
								variant="contained"
								disabled={isSubmitting}
								isAdmin={isAdmin}
							>
								{isSubmitting ? "Signing in..." : `Sign In ${isAdmin ? 'as Admin' : ''}`}
							</LoginButton>

							{isAdmin && (
								<Box sx={{ mt: 2, mb: 2 }}>
									<Button
										fullWidth
										variant="outlined"
										color="secondary"
										onClick={() => navigate('/signin')}
										sx={{ py: 1.5 }}
									>
										Switch to User Login
									</Button>
								</Box>
							)}

							{!isAdmin && (
								<Box sx={{ mt: 2, mb: 2 }}>
									<Button
										fullWidth
										variant="outlined"
										color="primary"
										onClick={() => navigate('/admin-signin')}
										sx={{ py: 1.5 }}
									>
										Go to Admin Login
									</Button>
								</Box>
							)}

							<Box sx={{ textAlign: "center", mt: 3 }}>
								<Typography variant="body2" color="text.secondary">
									By continuing, you agree to our
									<Link href="#" sx={{ color: isAdmin ? "#673ab7" : "#1D9BF0", mx: 0.5 }}>
										Terms of Service
									</Link>
									and
									<Link href="#" sx={{ color: isAdmin ? "#673ab7" : "#1D9BF0", ml: 0.5 }}>
										Privacy Policy
									</Link>
								</Typography>
							</Box>
						</Box>
					</FormContainer>
				</FormSide>
			</Grid>
		</Grid>
	);
};

export default SignInPage;