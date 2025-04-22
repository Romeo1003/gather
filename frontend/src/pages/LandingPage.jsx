import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Gather
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Your one-stop solution for event management
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button 
              component={Link} 
              to="/signin" 
              variant="contained" 
              color="secondary" 
              size="large"
              sx={{ mx: 1 }}
            >
              Sign In
            </Button>
            <Button 
              component={Link} 
              to="/signup" 
              variant="outlined" 
              color="inherit" 
              size="large"
              sx={{ mx: 1 }}
            >
              Sign Up
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" gutterBottom align="center">
          Features
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" component="h3" gutterBottom>
                Event Creation
              </Typography>
              <Typography variant="body1">
                Create and manage events with ease. Add details, set dates, and customize your event page.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" component="h3" gutterBottom>
                Registration Management
              </Typography>
              <Typography variant="body1">
                Handle registrations, track attendees, and manage capacity for your events.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" component="h3" gutterBottom>
                Analytics & Insights
              </Typography>
              <Typography variant="body1">
                Get valuable insights about your events and attendees to improve future events.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.200', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center" color="text.secondary">
            © {new Date().getFullYear()} Gather. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;