import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Paper, Button, Card, CardContent, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthProvider';

const OrganiserDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/organiser/events');
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Organiser Dashboard
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          component={Link}
          to="/o/dashboard/create-event"
        >
          Create New Event
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              My Events
            </Typography>
            
            {loading ? (
              <Typography>Loading events...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : events.length === 0 ? (
              <Typography>
                You haven't created any events yet. Click "Create New Event" to get started.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {events.map((event) => (
                  <Grid item xs={12} key={event.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{event.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(event.startDate).toLocaleDateString()} at {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Registrations: {event.registrationCount || 0}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" component={Link} to={`/o/dashboard/events/${event.id}`}>
                          View Details
                        </Button>
                        <Button size="small" component={Link} to={`/o/dashboard/events/${event.id}/edit`}>
                          Edit
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <Typography variant="body1" paragraph>
              Total Events: {events.length}
            </Typography>
            <Typography variant="body1" paragraph>
              Upcoming Events: {events.filter(e => new Date(e.startDate) > new Date()).length}
            </Typography>
            <Typography variant="body1">
              Total Registrations: {events.reduce((sum, event) => sum + (event.registrationCount || 0), 0)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrganiserDashboard;