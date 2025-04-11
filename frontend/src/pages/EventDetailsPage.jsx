import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid,
  Chip,
  Divider,
  Avatar,
  Skeleton,
  Alert,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon,
  Event as EventIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import Header from '../components/EventDashboard/Header';
import Sidebar from '../components/EventDashboard/Sidebar';
import axios from 'axios';
import { format } from 'date-fns';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5001/api/events/${eventId}`);
        setEvent(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  // If we don't have real data yet, use this placeholder
  const dummyEvent = {
    id: eventId || '1',
    title: 'Tech Innovation Summit 2024',
    description: 'Annual technology conference featuring the latest innovations in the tech industry. Join industry leaders, innovators, and tech enthusiasts for a day of inspiring talks, hands-on workshops, and networking opportunities. Explore emerging technologies including AI, blockchain, and IoT.',
    startDate: '2024-06-15',
    endDate: '2024-06-16',
    timeSlot: '9:00 AM - 5:00 PM',
    location: 'Tech Convention Center, San Francisco',
    capacity: 300,
    registered: 120,
    price: 299,
    status: 'published',
    banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    venue: {
      name: 'Tech Convention Center',
      location: 'San Francisco, CA',
      capacity: 350,
      services: ['Catering', 'Audio/Visual', 'Wi-Fi', 'Technical Support']
    },
    requiredServices: ['Catering', 'Photography', 'Technical Support'],
    organizer: {
      name: 'TechEvents Inc.',
      email: 'contact@techevents.com'
    },
    category: 'Technology'
  };

  // Use the real event or fallback to dummy data for display
  const displayEvent = event || dummyEvent;

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (err) {
      console.error('Date formatting error:', err);
      return dateString;
    }
  };

  // Calculate remaining capacity
  const remainingCapacity = displayEvent.capacity - (displayEvent.registered || 0);

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
          {/* Back Button & Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{ mr: 2, bgcolor: 'rgba(0, 0, 0, 0.04)' }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1" fontWeight="bold">
              Event Details
            </Typography>

            {/* Admin Edit Button (shown when not loading) */}
            {!loading && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                sx={{ ml: 'auto' }}
                onClick={() => navigate(`/dashboard/edit-event/${displayEvent.id}`)}
              >
                Edit Event
              </Button>
            )}
          </Box>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            // Loading Skeletons
            <Box>
              <Skeleton variant="rectangular" height={300} sx={{ mb: 3, borderRadius: 2 }} />
              <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
                </Grid>
              </Grid>
            </Box>
          ) : (
            // Event Details
            <Box>
              {/* Event Banner */}
              <Paper
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 3,
                  height: 300,
                  position: 'relative',
                  backgroundImage: `url(${displayEvent.banner})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                    p: 2,
                    color: 'white',
                  }}
                >
                  <Typography variant="h4" fontWeight="bold">
                    {displayEvent.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip
                      label={displayEvent.status.toUpperCase()}
                      size="small"
                      color={displayEvent.status === 'published' ? 'success' : 'default'}
                    />
                    {displayEvent.category && (
                      <Chip
                        label={displayEvent.category}
                        size="small"
                        color="primary"
                      />
                    )}
                  </Box>
                </Box>
              </Paper>

              <Grid container spacing={3}>
                {/* Main Event Details */}
                <Grid item xs={12} md={8}>
                  <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Event Description
                    </Typography>
                    <Typography paragraph>{displayEvent.description}</Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Event Details
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                            <CalendarIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Date
                            </Typography>
                            <Typography variant="body1">
                              {formatDate(displayEvent.startDate)}
                              {displayEvent.endDate && displayEvent.endDate !== displayEvent.startDate && 
                                ` - ${formatDate(displayEvent.endDate)}`}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                            <TimeIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Time
                            </Typography>
                            <Typography variant="body1">
                              {displayEvent.timeSlot || 'To be announced'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                            <LocationIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Location
                            </Typography>
                            <Typography variant="body1">
                              {displayEvent.location || displayEvent.venue?.location || 'To be announced'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                            <PeopleIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Capacity
                            </Typography>
                            <Typography variant="body1">
                              {displayEvent.capacity} people 
                              {displayEvent.registered > 0 &&
                                ` (${displayEvent.registered} registered, ${remainingCapacity} spots left)`}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {displayEvent.price !== undefined && (
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                              <MoneyIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Price
                              </Typography>
                              <Typography variant="body1">
                                {displayEvent.price === 0 || displayEvent.price === '' 
                                  ? 'Free' 
                                  : `$${displayEvent.price}`}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}
                    </Grid>

                    {/* Venue Details */}
                    {displayEvent.venue && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Venue Details
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            {displayEvent.venue.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {displayEvent.venue.location}
                          </Typography>
                          <Typography variant="body2" paragraph>
                            This venue can accommodate up to {displayEvent.venue.capacity} people.
                          </Typography>
                          {displayEvent.venue.services && displayEvent.venue.services.length > 0 && (
                            <Box>
                              <Typography variant="body2" gutterBottom>
                                <strong>Available Services:</strong>
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {displayEvent.venue.services.map((service, index) => (
                                  <Chip key={index} label={service} size="small" />
                                ))}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </>
                    )}

                    {/* Required Services */}
                    {displayEvent.requiredServices && displayEvent.requiredServices.length > 0 && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Required Services
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {displayEvent.requiredServices.map((service, index) => (
                            <Chip key={index} label={service} size="small" />
                          ))}
                        </Box>
                      </>
                    )}
                  </Paper>
                </Grid>

                {/* Sidebar with Registration and Other Info */}
                <Grid item xs={12} md={4}>
                  {/* Registration Card */}
                  <Card sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        Registration
                      </Typography>
                      
                      {remainingCapacity > 0 ? (
                        <>
                          <Typography variant="h4" color="primary.main" fontWeight="bold" sx={{ mb: 2 }}>
                            {displayEvent.price === 0 || displayEvent.price === '' 
                              ? 'Free' 
                              : `$${displayEvent.price}`}
                          </Typography>
                          
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" gutterBottom>
                              <strong>{remainingCapacity}</strong> spots remaining out of {displayEvent.capacity}
                            </Typography>
                            <Box sx={{ width: '100%', bgcolor: '#e0e0e0', height: 8, borderRadius: 5, mt: 1 }}>
                              <Box sx={{ 
                                width: `${(displayEvent.registered / displayEvent.capacity) * 100}%`, 
                                bgcolor: 'primary.main', 
                                height: 8, 
                                borderRadius: 5 
                              }} />
                            </Box>
                          </Box>
                          
                          <Button 
                            variant="contained" 
                            fullWidth
                            size="large"
                            sx={{ 
                              borderRadius: 8,
                              textTransform: "none",
                              py: 1.5,
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            Register Now
                          </Button>
                        </>
                      ) : (
                        <>
                          <Alert severity="warning" sx={{ mb: 2 }}>
                            This event is fully booked
                          </Alert>
                          <Button 
                            variant="outlined" 
                            fullWidth
                            size="large"
                            sx={{ 
                              borderRadius: 8,
                              textTransform: "none",
                              py: 1.5,
                            }}
                          >
                            Join Waitlist
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Organizer Info Card */}
                  {displayEvent.organizer && (
                    <Card sx={{ mb: 3, borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                          Organizer Information
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {displayEvent.organizer.name}
                        </Typography>
                        {displayEvent.organizer.email && (
                          <Typography variant="body2" color="text.secondary">
                            Contact: {displayEvent.organizer.email}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Additional Information */}
                  <Card sx={{ borderRadius: 2, bgcolor: '#f5f7ff' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <InfoIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold">
                          Additional Information
                        </Typography>
                      </Box>
                      <Typography variant="body2" paragraph>
                        Please arrive 15 minutes before the event start time for registration.
                      </Typography>
                      <Typography variant="body2">
                        For any questions or special requests, please contact the event organizer.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EventDetailsPage; 