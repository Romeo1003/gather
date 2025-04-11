import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Paper,
  Link,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  Key,
  AdminPanelSettings,
  Security
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Styled components
const BlueSide = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4a3b96 0%, #2c1e69 100%)', // Enhanced gradient
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
  background: '#f9f7ff', // Light purple tint for admin form side
}));

const FormContainer = styled(Box)(({ theme }) => ({
  maxWidth: 400,
  width: '100%',
  margin: '0 auto',
}));

const AdminBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 20,
  right: 20,
  backgroundColor: '#4a3b96',
  color: 'white',
  padding: '4px 12px',
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  zIndex: 10,
}));

const AdminSignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    adminCode: '' // Added admin code field
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    navigate('/signin');
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
    if (!formData.adminCode) {
      newErrors.adminCode = 'Admin code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // For admin signup, we need to use the admin creation endpoint
      // This will typically require authorization, so an existing admin would need to create new admins
      // For this demo, we'll use a separate endpoint with a secret code
      const response = await axios.post('http://localhost:5001/api/auth/admin-signup', formData);
      
      if (response.status === 201) {
        setSuccess(true);
        
        // Redirect to signin page after a short delay to show success message
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      }
    } catch (error) {
      console.error("Admin signup error:", error);
      
      if (error.response) {
        if (error.response.data.message === 'Invalid admin code') {
          setErrors({ adminCode: 'Invalid admin code' });
        } else if (error.response.data.message === 'Email already in use.') {
          setErrors({ email: 'Email is already in use' });
        } else if (error.response.data.errors) {
          const backendErrors = {};
          error.response.data.errors.forEach(err => {
            backendErrors[err.path] = err.msg;
          });
          setErrors(backendErrors);
        } else {
          setErrors({ general: error.response.data.message || 'Registration failed' });
        }
      } else if (error.request) {
        setErrors({ general: "No response from server. Please try again later." });
      } else {
        setErrors({ general: error.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          p: 3,
          background: '#f9f7ff', // Light purple background for success page
        }}
      >
        <AdminPanelSettings sx={{ fontSize: 60, color: '#4a3b96', mb: 3 }} />
        <Alert
          severity="success"
          sx={{ mb: 3, width: '100%', maxWidth: 500 }}
        >
          Admin account created successfully! Redirecting to login page...
        </Alert>
        <CircularProgress sx={{ color: '#4a3b96' }} />
      </Box>
    );
  }

  return (
    <Grid container sx={{ height: '100vh', position: 'relative' }}>
      <AdminBadge>
        <Security fontSize="small" />
        <Typography variant="body2" fontWeight="bold">ADMIN AREA</Typography>
      </AdminBadge>
      
      {/* Left side with illustrations */}
      <Grid item xs={12} md={6}>
        <BlueSide>
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
              Admin Registration
            </Typography>
            <Typography variant="h6" color="white" sx={{ mt: 2, opacity: 0.9 }}>
              Create an administrator account to manage events, users, and system settings.
            </Typography>
            <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
            <Typography variant="body1" color="white" sx={{ opacity: 0.7 }}>
              Requires a valid administrator code.
            </Typography>
          </Box>
        </BlueSide>
      </Grid>

      {/* Right side with form */}
      <Grid item xs={12} md={6}>
        <FormSide>
          <FormContainer>
            {/* Header */}
            <Paper 
              elevation={3} 
              sx={{ 
                mb: 4, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                p: 2,
                background: 'linear-gradient(135deg, #4a3b96 0%, #2c1e69 100%)',
                color: 'white',
                borderRadius: '10px'
              }}
            >
              <AdminPanelSettings sx={{ fontSize: 40, mr: 1 }} />
              <Typography variant="h4" component="h1" fontWeight="bold">
                Admin Signup
              </Typography>
            </Paper>

            {/* Form fields */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              {errors.general && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.general}
                </Alert>
              )}
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full name"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                error={Boolean(errors.name)}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
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
                  )
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="adminCode"
                label="Admin Secret Code"
                type={showPassword ? 'text' : 'password'}
                id="adminCode"
                value={formData.adminCode}
                onChange={handleChange}
                error={Boolean(errors.adminCode)}
                helperText={errors.adminCode}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Key />
                    </InputAdornment>
                  )
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 3, 
                  mb: 2, 
                  py: 1.5,
                  bgcolor: '#4a3b96',
                  '&:hover': {
                    bgcolor: '#2c1e69',
                  }
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Register Admin Account'}
              </Button>
              
              <Grid container>
                <Grid item xs>
                  <Link href="/signin" variant="body2" sx={{ color: '#4a3b96' }}>
                    Already have an account? Sign in
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/" variant="body2" sx={{ color: '#4a3b96' }}>
                    Return to home page
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </FormContainer>
        </FormSide>
      </Grid>
    </Grid>
  );
};

export default AdminSignupPage; 