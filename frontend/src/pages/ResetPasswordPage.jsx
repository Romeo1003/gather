import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Container, Link as MuiLink, Alert } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Extract token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    
    if (!tokenParam) {
      setErrors({ general: 'Invalid or missing reset token' });
    } else {
      setToken(tokenParam);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!passwords.password) {
      newErrors.password = 'Password is required';
    } else if (passwords.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (passwords.password !== passwords.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      await axios.post('/api/auth/reset-password', {
        token,
        password: passwords.password
      });
      
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/signin', { 
          state: { message: 'Password has been reset successfully. You can now sign in with your new password.' } 
        });
      }, 3000);
      
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({
          ...errors,
          general: error.response.data.message || 'Failed to reset password'
        });
      } else {
        setErrors({
          ...errors,
          general: 'Failed to reset password. Please try again.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          
          {isSuccess ? (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Your password has been reset successfully!
              </Alert>
              <Typography variant="body2">
                Redirecting to sign in page...
              </Typography>
            </Box>
          ) : (
            <>
              {errors.general && (
                <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                  {errors.general}
                </Alert>
              )}
              
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="New Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={passwords.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  disabled={!token || isLoading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  id="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  disabled={!token || isLoading}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={!token || isLoading}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
                <Box sx={{ textAlign: 'center' }}>
                  <MuiLink component={Link} to="/signin" variant="body2">
                    Return to Sign In
                  </MuiLink>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;