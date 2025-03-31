import React, { useState } from "react";
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
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../hooks/useAuth";


// Styled components (unchanged)
const BlueSide = styled(Box)(({ theme }) => ({
	backgroundColor: "#59BBF6",
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

const SignInPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [tabValue, setTabValue] = useState(1);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		rememberMe: false,
	});
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();
	const { login } = useAuth();

	const handleClickShowPassword = () => setShowPassword(!showPassword);

	const handleTabChange = (_, newValue) => {
		navigate(newValue === 0 ? "/signup" : "/signin");
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
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setIsSubmitting(true);
		try {
			const { data } = await axios.post(
				"http://localhost:5000/api/auth/login",
				{
					email: formData.email,
					password: formData.password,
				},
				{ withCredentials: true } // Important for cookies
			);

			// Store token in localStorage if "Remember me" is checked
			if (formData.rememberMe) {
				localStorage.setItem("token", data.token);
			}

			// Call login function from AuthContext
			login(data.token);
		} catch (error) {
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
				<BlueSide>
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
							Welcome to Our Platform
						</Typography>
						<Typography variant="h6" color="white" sx={{ mt: 2, opacity: 0.9 }}>
							Manage your events with ease and connect with attendees seamlessly.
						</Typography>
					</Box>
				</BlueSide>
			</Grid>

			{/* Right side with form */}
			<Grid item xs={12} md={6}>
				<FormSide>
					<FormContainer>
						{/* Tabs */}
						<Paper elevation={0} sx={{ mb: 4 }}>
							<Tabs
								value={tabValue}
								onChange={handleTabChange}
								variant="fullWidth"
								indicatorColor="primary"
								textColor="primary"
							>
								<Tab label="Sign Up" />
								<Tab label="Sign In" />
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
								sx={{ mb: 2 }}
							/>

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
											color="primary"
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
									sx={{ color: "#1D9BF0" }}
								>
									Forgot password?
								</Link>
							</Box>

							<Button
								type="submit"
								fullWidth
								variant="contained"
								disabled={isSubmitting}
								sx={{
									mt: 2,
									mb: 2,
									py: 1.5,
									backgroundColor: "#1D9BF0",
									color: "white",
									"&:hover": {
										backgroundColor: "#0E87D3",
									},
								}}
							>
								{isSubmitting ? "Signing in..." : "Sign In"}
							</Button>

							<Box sx={{ textAlign: "center", mt: 3 }}>
								<Typography variant="body2" color="text.secondary">
									By continuing, you agree to our
									<Link href="#" sx={{ color: "#1D9BF0", mx: 0.5 }}>
										Terms of Service
									</Link>
									and
									<Link href="#" sx={{ color: "#1D9BF0", ml: 0.5 }}>
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