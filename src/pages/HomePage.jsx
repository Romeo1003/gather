import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  Chip,
  CircularProgress
} from '@mui/material';
import { CalendarMonth, LocationOn, ArrowForward } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

// For demo purposes, we'll use these sample events if the API call fails
const sampleEvents = [
  {
    id: 'abc123',
    title: 'Web Development Workshop',
    description: 'Learn the basics of web development with HTML, CSS, and JavaScript.',
    startDate: new Date(2025, 4, 15),
    endDate: new Date(2025, 4, 15),
    time: '10:00 AM - 4:00 PM',
    location: 'Tech Hub, Building A',
    image: '/src/assets/images/event1.jpg',
    price: 0,
  },
  {
    id: 'def456',
    title: 'AI Conference 2025',
    description: 'The latest advancements in artificial intelligence and machine learning.',
    startDate: new Date(2025, 4, 20),
    endDate: new Date(2025, 4, 22),
    time: '9:00 AM - 5:00 PM',
    location: 'Grand Convention Center',
    image: '/src/assets/images/event2.jpg',
    price: 299,
  },
  {
    id: 'ghi789',
    title: 'Startup Networking Night',
    description: 'Connect with other entrepreneurs and investors in a casual setting.',
    startDate: new Date(2025, 4, 25),
    endDate: new Date(2025, 4, 25),
    time: '6:30 PM - 9:00 PM',
    location: 'Downtown Business Center',
    image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 25,
  },
];

const EventCard = ({ event }) => {
  return (
    <Card elevation={1} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={event.image}
        alt={event.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 600 }}>
          {event.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarMonth fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {format(new Date(event.startDate), 'MMM d, yyyy')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOn fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {event.location}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {event.description}
        </Typography>
        {event.price > 0 ? (
          <Chip 
            label={`$${event.price}`} 
            color="primary" 
            size="small" 
            variant="outlined"
          />
        ) : (
          <Chip 
            label="Free" 
            color="success" 
            size="small" 
            variant="outlined"
          />
        )}
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          component={RouterLink} 
          to={`/events/${event.id}`}
          endIcon={<ArrowForward />}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        // Use sample data if the API call fails
        setEvents(sampleEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          backgroundColor: 'primary.main', 
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle, rgba(99,102,241,0.8) 0%, rgba(99,102,241,1) 100%)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Discover, Connect, and Attend Amazing Events
              </Typography>
              <Typography 
                variant="h5" 
                paragraph
                sx={{ 
                  mb: 4,
                  opacity: 0.9 
                }}
              >
                Find the perfect events for networking, learning, and entertainment.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  component={RouterLink}
                  to="/events"
                  sx={{ 
                    backgroundColor: 'white', 
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                >
                  Explore Events
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  component={RouterLink}
                  to="/register"
                  sx={{ 
                    borderColor: 'white', 
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  Create Account
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              {/* The decorative element would go here */}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Events Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h3" component="h2">
            Featured Events
          </Typography>
          <Button 
            component={RouterLink}
            to="/events"
            endIcon={<ArrowForward />}
          >
            View All
          </Button>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {events.slice(0, 3).map((event) => (
              <Grid item key={event.id} xs={12} sm={6} md={4}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Call to Action */}
      <Box sx={{ backgroundColor: 'grey.100', py: 8 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" component="h2" gutterBottom>
              Ready to Host Your Own Event?
            </Typography>
            <Typography variant="h5" paragraph color="text.secondary" sx={{ mb: 4 }}>
              Create and manage your events with our easy-to-use platform.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              component={RouterLink}
              to="/register"
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 