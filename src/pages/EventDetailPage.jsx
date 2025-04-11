import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent,
  Chip,
  Divider,
  Paper,
  TextField,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link
} from '@mui/material';
import { 
  CalendarMonth, 
  AccessTime,
  LocationOn,
  Person,
  ArrowBackIos,
  Home as HomeIcon,
  Event as EventIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

// Sample event data for when API call fails
const sampleEvents = [
  {
    id: 'abc123',
    title: 'Web Development Workshop',
    description: 'Learn the basics of web development with HTML, CSS, and JavaScript. This workshop is designed for beginners who want to get started with web development. We will cover the fundamentals of HTML structure, CSS styling, and JavaScript programming. By the end of this workshop, you will have built a simple interactive website from scratch.',
    startDate: new Date(2025, 4, 15),
    endDate: new Date(2025, 4, 15),
    time: '10:00 AM - 4:00 PM',
    location: 'Tech Hub, Building A',
    address: '123 Innovation Street, Tech District, San Francisco, CA 94105',
    image: '/src/assets/images/event1.jpg',
    price: 0,
    registered: 45,
    capacity: 100,
    organizer: 'Tech Learning Alliance',
    category: 'Workshop',
    requirements: 'Bring your own laptop. No prior programming experience needed.',
    featured: true
  },
  {
    id: 'def456',
    title: 'AI Conference 2025',
    description: 'The latest advancements in artificial intelligence and machine learning. Join industry leaders and academic researchers for three days of presentations, workshops, and networking opportunities. Topics will include deep learning, natural language processing, computer vision, robotics, ethics in AI, and more.',
    startDate: new Date(2025, 4, 20),
    endDate: new Date(2025, 4, 22),
    time: '9:00 AM - 5:00 PM',
    location: 'Grand Convention Center',
    address: '500 Conference Way, Downtown, San Francisco, CA 94103',
    image: '/src/assets/images/event2.jpg',
    price: 299,
    registered: 356,
    capacity: 800,
    organizer: 'AI Research Foundation',
    category: 'Conference',
    requirements: 'Professional or academic experience in AI recommended.',
    featured: true
  },
];

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [registerFormData, setRegisterFormData] = useState({
    name: '',
    email: '',
    phone: '',
    agreeToTerms: false
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API
        const response = await axios.get(`http://localhost:5001/api/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
        
        // If API fails, try to find the event in sample data
        const sampleEvent = sampleEvents.find(e => e.id === id);
        if (sampleEvent) {
          setEvent(sampleEvent);
        } else {
          setError('Event not found. The event may have been removed or the ID is incorrect.');
          navigate('/events', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, navigate]);

  const handleOpenRegisterDialog = () => {
    setOpenRegisterDialog(true);
  };

  const handleCloseRegisterDialog = () => {
    setOpenRegisterDialog(false);
  };

  const handleRegisterFormChange = (e) => {
    const { name, value, checked } = e.target;
    setRegisterFormData({
      ...registerFormData,
      [name]: name === 'agreeToTerms' ? checked : value,
    });
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!registerFormData.name || !registerFormData.email || !registerFormData.agreeToTerms) {
      return; // Form validation would normally show errors
    }
    
    try {
      // In a real app, we'd submit to the API
      // await axios.post(`http://localhost:5001/api/events/${id}/register`, registerFormData);
      
      // For demo purposes, just simulate success
      setRegistrationSuccess(true);
      setTimeout(() => {
        setOpenRegisterDialog(false);
        // In a real app, we might refresh the event data here to show updated registration count
      }, 3000);
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="outlined" 
            component={RouterLink} 
            to="/events" 
            startIcon={<ArrowBackIos />}
          >
            Back to Events
          </Button>
        </Box>
      </Container>
    );
  }

  if (!event) return null;
  
  const isFullyBooked = event.registered >= event.capacity;

  return (
    <Box>
      {/* Hero header with image */}
      <Box 
        sx={{ 
          position: 'relative',
          height: { xs: '30vh', md: '50vh' },
          backgroundImage: `url(${event.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ height: '100%', position: 'relative', zIndex: 2 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'flex-end',
              height: '100%',
              pb: 4 
            }}
          >
            <Box sx={{ mb: 1 }}>
              <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                <Link 
                  component={RouterLink} 
                  to="/"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: 'rgba(255,255,255,0.7)',
                    '&:hover': { color: 'white' }
                  }}
                >
                  <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                  Home
                </Link>
                <Link
                  component={RouterLink}
                  to="/events"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: 'rgba(255,255,255,0.7)',
                    '&:hover': { color: 'white' }
                  }}
                >
                  <EventIcon sx={{ mr: 0.5, fontSize: 18 }} />
                  Events
                </Link>
                <Typography color="white" sx={{ display: 'flex', alignItems: 'center' }}>
                  {event.title}
                </Typography>
              </Breadcrumbs>
            </Box>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                color: 'white', 
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              {event.title}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {event.category && (
                <Chip 
                  label={event.category} 
                  size="medium" 
                  color="secondary"
                  sx={{ color: 'white' }}
                />
              )}
              {event.price > 0 ? (
                <Chip 
                  label={`$${event.price}`} 
                  color="primary" 
                  size="medium" 
                  sx={{ backgroundColor: 'white', color: 'primary.main' }}
                />
              ) : (
                <Chip 
                  label="Free" 
                  color="success" 
                  size="medium" 
                  sx={{ backgroundColor: 'white', color: 'success.main' }}
                />
              )}
              {event.featured && (
                <Chip 
                  label="Featured" 
                  color="warning" 
                  size="medium"
                  sx={{ backgroundColor: 'white', color: 'warning.main' }}
                />
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Event details */}
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h2" gutterBottom>
              About this event
            </Typography>
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ 
                whiteSpace: 'pre-line',
                mb: 4
              }}
            >
              {event.description}
            </Typography>

            {event.requirements && (
              <>
                <Typography variant="h5" component="h3" gutterBottom>
                  What to bring
                </Typography>
                <Typography 
                  variant="body1" 
                  paragraph 
                  sx={{ mb: 4 }}
                >
                  {event.requirements}
                </Typography>
              </>
            )}

            <Box sx={{ my: 4 }}>
              <Divider />
            </Box>

            <Typography variant="h5" component="h3" gutterBottom>
              Organizer
            </Typography>
            <Typography variant="body1" paragraph>
              {event.organizer || 'Event organizer information not available'}
            </Typography>

            <Box sx={{ my: 4 }}>
              <Button 
                variant="outlined" 
                component={RouterLink} 
                to="/events" 
                startIcon={<ArrowBackIos />}
                sx={{ mr: 2 }}
              >
                Back to Events
              </Button>
            </Box>
          </Grid>

          {/* Sidebar with registration */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" component="h3" gutterBottom>
                Event Details
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarMonth color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2">Date</Typography>
                  <Typography variant="body1">
                    {format(new Date(event.startDate), 'EEEE, MMMM d, yyyy')}
                    {event.endDate && new Date(event.startDate).toDateString() !== new Date(event.endDate).toDateString() && 
                      ` - ${format(new Date(event.endDate), 'EEEE, MMMM d, yyyy')}`
                    }
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTime color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2">Time</Typography>
                  <Typography variant="body1">{event.time}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2">Location</Typography>
                  <Typography variant="body1">{event.location}</Typography>
                  {event.address && (
                    <Typography variant="body2" color="text.secondary">{event.address}</Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Person color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2">Capacity</Typography>
                  <Typography variant="body1">
                    {event.registered || 0} / {event.capacity || 'Unlimited'} registered
                  </Typography>
                </Box>
              </Box>

              <Button 
                variant="contained" 
                fullWidth 
                size="large"
                disabled={isFullyBooked}
                onClick={handleOpenRegisterDialog}
                sx={{ mb: 2 }}
              >
                {isFullyBooked ? 'Fully Booked' : 'Register Now'}
              </Button>

              {isFullyBooked && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  This event is fully booked.
                </Alert>
              )}

              {event.price > 0 && (
                <Typography 
                  variant="body2" 
                  align="center" 
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Registration fee: ${event.price}
                </Typography>
              )}
            </Paper>

            <Card sx={{ mt: 3, borderRadius: 2 }}>
              <CardMedia
                component="img"
                height="120"
                image={event.image}
                alt={event.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Share this event
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {/* In a real app, these would be actual social sharing buttons */}
                  <Button size="small" variant="outlined">Share</Button>
                  <Button size="small" variant="outlined">Tweet</Button>
                  <Button size="small" variant="outlined">Email</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Registration Dialog */}
        <Dialog open={openRegisterDialog} onClose={handleCloseRegisterDialog} maxWidth="sm" fullWidth>
          <form onSubmit={handleSubmitRegistration}>
            <DialogTitle>
              {registrationSuccess ? 'Registration Complete!' : `Register for ${event.title}`}
            </DialogTitle>
            <DialogContent>
              {registrationSuccess ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <CheckIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                  <DialogContentText>
                    Thank you for registering! We've sent a confirmation email with all the details.
                  </DialogContentText>
                </Box>
              ) : (
                <>
                  <DialogContentText>
                    Please fill out the following information to register for this event.
                    {event.price > 0 && ` Registration fee: $${event.price}`}
                  </DialogContentText>
                  <TextField
                    margin="dense"
                    name="name"
                    label="Full Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    required
                    value={registerFormData.name}
                    onChange={handleRegisterFormChange}
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    margin="dense"
                    name="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="outlined"
                    required
                    value={registerFormData.email}
                    onChange={handleRegisterFormChange}
                  />
                  <TextField
                    margin="dense"
                    name="phone"
                    label="Phone Number"
                    type="tel"
                    fullWidth
                    variant="outlined"
                    value={registerFormData.phone}
                    onChange={handleRegisterFormChange}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        name="agreeToTerms"
                        checked={registerFormData.agreeToTerms}
                        onChange={handleRegisterFormChange}
                        required
                      />
                    }
                    label="I agree to the terms and conditions"
                    sx={{ mt: 2 }}
                  />
                </>
              )}
            </DialogContent>
            <DialogActions>
              {!registrationSuccess && (
                <>
                  <Button onClick={handleCloseRegisterDialog}>Cancel</Button>
                  <Button 
                    type="submit" 
                    variant="contained"
                    disabled={!registerFormData.name || !registerFormData.email || !registerFormData.agreeToTerms}
                  >
                    Register
                  </Button>
                </>
              )}
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
};

export default EventDetailPage; 