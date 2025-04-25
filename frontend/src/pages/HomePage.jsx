import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '80vh',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                mb: 2,
              }}
            >
              Plan Your Next Event with Gather
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                color: 'text.secondary',
                mb: 4,
              }}
            >
              The modern platform for seamless event management and coordination
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {!user ? (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/signup')}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/signin')}
                  >
                    Sign In
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </Button>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/src/assets/landing-hero.svg"
              alt="Event Planning Illustration"
              sx={{
                width: '100%',
                height: 'auto',
                maxWidth: 600,
                display: 'block',
                mx: 'auto',
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: 8 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Create Events
            </Typography>
            <Typography color="text.secondary">
              Easily create and manage events with our intuitive interface.
              Set dates, venues, and capacities with just a few clicks.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Track Attendance
            </Typography>
            <Typography color="text.secondary">
              Monitor registrations, send invitations, and manage guest lists
              all in one place.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Real-time Updates
            </Typography>
            <Typography color="text.secondary">
              Get instant notifications and updates about your events.
              Stay connected with your attendees.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;