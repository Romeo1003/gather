import React, { useState } from 'react';
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
  Avatar
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  AdminPanelSettings
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Styled components with color options
const SideBanner = styled(Box)(({ theme, isAdmin }) => ({
  backgroundColor: isAdmin ? '#673ab7' : '#59BBF6', // Purple for admin, Blue for users
  height: '100vh',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(6),
  overflow: 'hidden',
}));

const FloatingShape = styled(Box)(({
  size = 100,
  top,
  left,
  right,
  bottom,
  rotate = 0,
  opacity = 0.2
}) => ({
  position: 'absolute',
  width: size,
  height: size,
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  borderRadius: '10px',
  top,
  left,
  right,
  bottom,
  transform: `rotate(${rotate}deg)`,
  filter: 'blur(4px)',
  opacity,
}));

const FormSide = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(3),
}));

const FormContainer = styled(Box)(({ theme }) => ({
  maxWidth: 400,
  width: '100%',
  margin: '0 auto',
}));

const SignupButton = styled(Button)(({ isAdmin }) => ({
  marginTop: 16,
  marginBottom: 8,
  padding: '12px 0',
  backgroundColor: isAdmin ? '#673ab7' : '#1D9BF0', // Purple for admin, Blue for users
  color: 'white',
  '&:hover': {
    backgroundColor: isAdmin ? '#5e35b1' : '#0E87D3',
  },
}));

const SignupPage = ({ userType = "customer" }) => {
  const isAdmin = userType === "admin";
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    adminPin: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowPin = () => {
    setShowPin(!showPin);
  };

  const handleTabChange = (event, newValue) => {
    if (isAdmin) {
      navigate(newValue === 0 ? '/admin-signup' : '/admin-signin');
    } else {
      navigate(newValue === 0 ? '/signup' : '/signin');
    }
  };

  const handleAdminLinkClick = (e) => {
    e.preventDefault();
    navigate('/admin-signup');
  };

  const handleUserLinkClick = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Validate admin PIN if user is signing up as admin
    if (isAdmin && !formData.adminPin) {
      newErrors.adminPin = 'Admin authentication PIN is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started");

    if (!validateForm()) {
      console.log("Form validation failed", errors);
      return;
    }

    setIsSubmitting(true);
    console.log("Submitting form data:", formData);

    try {
      // Use the appropriate endpoint based on user type
      const endpoint = isAdmin 
        ? 'http://localhost:5001/api/auth/admin-signup'
        : 'http://localhost:5001/api/auth/signup';
  
      console.log(`Sending request to: ${endpoint}`);
      
      // Add admin PIN if registering as admin instead of hardcoded admin code
      const requestData = isAdmin 
        ? { 
            name: formData.name,
            email: formData.email,
            password: formData.password,
            adminCode: formData.adminPin
          }
        : formData;
        
      const response = await axios.post(endpoint, requestData);
      console.log("Signup response:", response);

      if (response.status === 201) {
        console.log("Registration successful, saving token");
        // Store the token (you might want to use context or redux for global state)
        localStorage.setItem('token', response.data.token);

        // Redirect to appropriate dashboard
        if (isAdmin) {
          navigate('/admin');
        } else {
          navigate('/dashboard/home');
        }
      }
    } catch (error) {
      console.error("Signup error full details:", error);
      
      if (error.response) {
        console.error("Server response error:", error.response.data);
        // Handle backend validation errors
        if (error.response.data.errors) {
          const backendErrors = {};
          error.response.data.errors.forEach(err => {
            backendErrors[err.path] = err.msg;
          });
          setErrors(backendErrors);
        } else if (error.response.data.message === 'Email already in use.') {
          setErrors({ email: 'Email is already in use' });
        } else if (error.response.data.message === 'Invalid admin code') {
          setErrors({ adminCode: 'Invalid administrator code' });
        } else {
          console.error('Signup error:', error.response.data);
          setErrors({ general: error.response.data.message || 'Registration failed' });
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        setErrors({ general: "No response from server. Please try again later." });
      } else {
        console.error('Signup error:', error.message);
        setErrors({ general: error.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid container sx={{ height: '100vh' }}>
      {/* Left side with illustrations */}
      <Grid item xs={12} md={6}>
        <SideBanner isAdmin={isAdmin}>
          {/* Floating geometric shapes */}
          <FloatingShape size={160} top="20%" left="20%" rotate={12} />
          <FloatingShape size={80} top="30%" right="20%" rotate={-12} />
          <FloatingShape size={60} bottom="20%" left="30%" rotate={45} />
          <FloatingShape size={50} top="15%" right="15%" rotate={-12} />
          <FloatingShape size={90} bottom="15%" right="20%" rotate={12} />
          <FloatingShape size={40} top="50%" left="15%" rotate={-45} />

          {/* Content */}
          <Box sx={{ position: 'relative', zIndex: 1, mt: 'auto' }}>
            <Typography variant="h3" component="h1" color="white" fontWeight="bold">
              {isAdmin ? "Admin Registration" : "Join Gather Today"}
            </Typography>
            <Typography variant="h6" color="white" sx={{ mt: 2, opacity: 0.9 }}>
              {isAdmin 
                ? "Register for administrative access to manage the platform."
                : "Create your account and start managing events with ease."
              }
            </Typography>
          </Box>
        </SideBanner>
      </Grid>

      {/* Right side with form */}
      <Grid item xs={12} md={6}>
        <FormSide>
          <FormContainer>
            {/* User Type Indicator with Icon */}
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
              {isAdmin ? "Administrator Sign Up" : "User Sign Up"}
            </Typography>
            
            {/* Tabs for Sign Up / Sign In */}
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

            {/* Form Fields */}
            <Box component="form" onSubmit={handleSubmit}>
              {errors.general && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {errors.general}
                </Typography>
              )}

              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Full Name
              </Typography>
              <TextField
                required
                fullWidth
                id="name"
                name="name"
                placeholder="Enter your full name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Email address
              </Typography>
              <TextField
                required
                fullWidth
                id="email"
                name="email"
                placeholder="Enter your email"
                autoComplete="email"
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
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Choose a password"
                autoComplete="new-password"
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
                sx={{ mb: isAdmin ? 3 : 4 }}
              />

              {/* Admin PIN field - only shown for admin signup */}
              {isAdmin && (
                <>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Admin Authentication PIN
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    name="adminPin"
                    type={showPin ? 'text' : 'password'}
                    id="adminPin"
                    placeholder="Enter administrator PIN"
                    value={formData.adminPin}
                    onChange={handleChange}
                    error={!!errors.adminPin}
                    helperText={errors.adminPin || "Secure PIN required for admin access"}
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
                    sx={{ mb: 4 }}
                  />
                </>
              )}

              <SignupButton
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                isAdmin={isAdmin}
              >
                {isSubmitting ? 'Creating account...' : `Create ${isAdmin ? 'Admin ' : ''}Account`}
              </SignupButton>

              {isAdmin && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    onClick={handleUserLinkClick}
                    sx={{ py: 1.5 }}
                  >
                    Switch to User Sign Up
                  </Button>
                </Box>
              )}

              {!isAdmin && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={handleAdminLinkClick}
                    sx={{ py: 1.5 }}
                  >
                    Go to Admin Sign Up
                  </Button>
                </Box>
              )}

              <Box sx={{ textAlign: 'center', mt: 3 }}>
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

export default SignupPage;