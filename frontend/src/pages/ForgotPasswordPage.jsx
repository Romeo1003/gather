import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Container, Link as MuiLink, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setIsSubmitted(true);
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Failed to process request');
      } else {
        setError('Failed to process request. Please try again later.');
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
            Forgot Password
          </Typography>
          
          {isSubmitted ? (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                If an account exists with this email, we've sent password reset instructions.
              </Alert>
              <Typography variant="body2" sx={{ mt: 2 }}>
                <MuiLink component={Link} to="/signin">
                  Return to Sign In
                </MuiLink>
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body2" sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
                Enter your email address and we'll send you instructions to reset your password.
              </Typography>
              
              {error && (
                <Alert severity="error" sx={{ mt: 1, mb: 2, width: '100%' }}>
                  {error}
                </Alert>
              )}
              
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!error}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <Box sx={{ textAlign: 'center' }}>
                  <MuiLink component={Link} to="/signin" variant="body2">
                    Remember your password? Sign In
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

export default ForgotPasswordPage;