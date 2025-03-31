import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  TextField, 
  Button, 
  InputAdornment, 
  Paper,
  Link,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Email,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Custom styled components for the blue background side
const BlueSide = styled(Box)(({ theme }) => ({
  backgroundColor: '#59BBF6',
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

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setSnackbarOpen(true);
      // In a real app, you would call an API here to send reset link
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleBackToSignIn = () => {
    navigate('/signin');
  };

  return (
    <Grid container sx={{ height: '100vh' }}>
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
              Secure Password Management
            </Typography>
            <Typography variant="h6" color="white" sx={{ mt: 2, opacity: 0.9 }}>
              Keep your accounts safe with our advanced password management system.
            </Typography>
          </Box>
        </BlueSide>
      </Grid>

      {/* Right side with form */}
      <Grid item xs={12} md={6}>
        <FormSide>
          <FormContainer>
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Forgot Password
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {!submitted 
                  ? "Enter your email address and we'll send you a link to reset your password."
                  : "We've sent you an email with instructions to reset your password."}
              </Typography>
            </Box>

            {/* Form fields */}
            {!submitted ? (
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                  value={email}
                  onChange={handleEmailChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ 
                    py: 1.5,
                    backgroundColor: '#1D9BF0',
                    '&:hover': {
                      backgroundColor: '#0E87D3',
                    }
                  }}
                >
                  Reset Password
                </Button>
              </Box>
            ) : (
              <Box sx={{ mt: 3 }}>
                <Paper
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    backgroundColor: '#f0f9ff',
                    borderRadius: 2,
                    mb: 3
                  }}
                >
                  <Typography variant="body1">
                    Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                  </Typography>
                </Paper>
                
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setSubmitted(false)}
                  sx={{ mb: 2 }}
                >
                  Try another email
                </Button>
              </Box>
            )}
            
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Remember your password?{' '}
                <Link 
                  href="#" 
                  onClick={handleBackToSignIn}
                  sx={{ color: '#1D9BF0' }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </FormContainer>
        </FormSide>
      </Grid>

      {/* Snackbar notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Password reset link sent to {email}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ForgotPasswordPage;