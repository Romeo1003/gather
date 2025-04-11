import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Tabs,
  Tab,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Event as EventIcon,
  Person as PersonIcon,
  CalendarMonth,
  LocationOn,
  ArrowForward
} from '@mui/icons-material';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import { format } from 'date-fns';

// Sample user data
const sampleUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'user',
  registeredEvents: [
    {
      id: 'abc123',
      title: 'Web Development Workshop',
      description: 'Learn the basics of web development with HTML, CSS, and JavaScript.',
      startDate: new Date(2025, 4, 15),
      endDate: new Date(2025, 4, 15),
      time: '10:00 AM - 4:00 PM',
      location: 'Tech Hub, Building A',
      image: '/src/assets/images/event1.jpg',
      status: 'Upcoming'
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
      status: 'Upcoming'
    }
  ]
};

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would fetch user data from your API
        // const response = await axios.get('http://localhost:5001/api/auth/me', {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
        // });
        // setUser(response.data);
        
        // For demo purposes, we'll use sample data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser(sampleUser);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Check if user is authenticated
    const token = localStorage.getItem('userToken');
    if (!token) {
      setLoading(false);
      return;
    }

    fetchUserData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Redirect to login if not authenticated
  if (!loading && !user && !localStorage.getItem('userToken')) {
    return <Navigate to="/login" replace />;
  }

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
      </Container>
    );
  }

  if (!user) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          My Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your registrations and account settings
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'primary.main',
                  mb: 2,
                  fontSize: '2rem'
                }}
              >
                {user.name.charAt(0)}
              </Avatar>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <List>
              <ListItem button selected component={RouterLink} to="/dashboard">
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem button component={RouterLink} to="/events">
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="Browse Events" />
              </ListItem>
              <ListItem button component={RouterLink} to="/profile">
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile Settings" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
                <Tab label="Registered Events" />
                <Tab label="Past Events" />
                <Tab label="Account Settings" />
              </Tabs>
            </Box>
            
            {/* Registered Events Tab */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>
                Your Registered Events
              </Typography>
              
              {user.registeredEvents.length > 0 ? (
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  {user.registeredEvents.map((event) => (
                    <Grid item xs={12} sm={6} key={event.id}>
                      <Card elevation={1} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h6" component="h3">
                            {event.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarMonth fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {format(new Date(event.startDate), 'MMM d, yyyy')}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <LocationOn fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {event.location}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              {event.status}
                            </Typography>
                          </Box>
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
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <EventIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No registered events
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    You haven't registered for any events yet
                  </Typography>
                  <Button 
                    variant="contained" 
                    component={RouterLink} 
                    to="/events"
                  >
                    Browse Events
                  </Button>
                </Box>
              )}
            </TabPanel>
            
            {/* Past Events Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Your Past Events
              </Typography>
              
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <EventIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No past events
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You haven't attended any events yet
                </Typography>
              </Box>
            </TabPanel>
            
            {/* Account Settings Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Account Settings
              </Typography>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                Account settings will be available in the next update.
              </Alert>
              
              <Button 
                variant="contained" 
                color="primary"
                component={RouterLink}
                to="/events"
                sx={{ mt: 2 }}
              >
                Browse Events
              </Button>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

// TabPanel component for the dashboard tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
      style={{ padding: 24 }}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

export default DashboardPage; 