import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Button, Container, Typography, Box, Grid } from '@mui/material';

const LandingPage = () => {
  const navigate = useNavigate();
  const { getMotionProps } = useTheme();

  return (
    <motion.div {...getMotionProps()}>
      <Container maxWidth="lg">
        <Box py={8}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Typography variant="h2" component="h1" gutterBottom>
                  Welcome to Gather
                </Typography>
                <Typography variant="h5" color="textSecondary" paragraph>
                  Your one-stop platform for creating and managing memorable events.
                </Typography>
                <Box mt={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/signin')}
                    sx={{ mr: 2 }}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/events')}
                  >
                    Browse Events
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src="/src/assets/landing-hero.svg"
                  alt="Event illustration"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: 500,
                    display: 'block',
                    margin: '0 auto',
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </motion.div>
  );
};

export default LandingPage;