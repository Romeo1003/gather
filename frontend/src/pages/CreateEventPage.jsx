import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, IconButton, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Header from '../components/EventDashboard/Header';
import Sidebar from '../components/EventDashboard/Sidebar';
import CreateEventForm from '../components/EventCreation/CreateEventForm';
import axios from 'axios';

const CreateEventPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fetch venues from the API
  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5001/api/venues');
        setVenues(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching venues:', err);
        setError('Failed to load venues. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        bgcolor: '#f9fafb',
      }}
    >
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: 'auto',
            transition: 'margin-left 0.25s ease-in-out',
            ml: { sm: sidebarOpen ? 30 : 0 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{ mr: 2, bgcolor: 'rgba(0, 0, 0, 0.04)' }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1" fontWeight="bold">
              Create New Event
            </Typography>
          </Box>

          {loading ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 2,
              }}
            >
              <Typography>Loading venues...</Typography>
            </Paper>
          ) : error ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                borderRadius: 2,
              }}
            >
              <Typography color="error">{error}</Typography>
              <Button variant="outlined" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </Paper>
          ) : (
            <CreateEventForm venues={venues} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CreateEventPage; 