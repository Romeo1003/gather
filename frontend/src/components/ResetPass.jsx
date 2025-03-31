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
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  Lock 
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

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate password
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // In a real app, you would call an API here to reset the password
    setSuccess(true);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    if (success) {
      navigate('/signin');
    }
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
                Reset Password
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {!success 
                  ? "Create a new password for your account."
                  : "Your password has been successfully reset."}
              </Typography>
            </Box>

            {/* Form fields */}
            {!success ? (
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  New Password
                </Typography>
                <TextField
                  required
                  fullWidth
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={handlePasswordChange}
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
                  sx={{ mb: 3 }}
                />
                
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Confirm New Password
                </Typography>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Password must be at least 8 characters long and include a mix of letters, numbers, and special characters.
                </Typography>

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
                    Your password has been successfully reset. You can now sign in with your new password.
                  </Typography>
                </Paper>
                
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleBackToSignIn}
                  sx={{ 
                    py: 1.5,
                    backgroundColor: '#1D9BF0',
                    '&:hover': {
                      backgroundColor: '#0E87D3',
                    }
                  }}
                >
                  Sign In
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
          Password successfully reset
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ResetPasswordPage;