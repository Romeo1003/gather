import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';

const CustomerDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Customer Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              My Upcoming Events
            </Typography>
            <Typography variant="body1">
              You have no upcoming events. Browse events to register.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Typography variant="body1" paragraph>
              • Browse Events
            </Typography>
            <Typography variant="body1" paragraph>
              • View My Registrations
            </Typography>
            <Typography variant="body1" paragraph>
              • Update Profile
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerDashboard;