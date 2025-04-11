// components/CustomerDashboard/CustomerDashboard.jsx
import { useState, useContext } from "react";
import { Box, Typography, Button, Card, CardContent, CardMedia, Grid, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Paper } from "@mui/material";
import Sidebar from "../EventDashboard/CustSidebar";
import Header from "../EventDashboard/Header";
import { CalendarToday as CalendarIcon, People as PeopleIcon, Theaters as TheatersIcon, AttachMoney as MoneyIcon, LocationOn as LocationIcon, WbSunny as WeatherIcon, VpnKey as InviteIcon } from "@mui/icons-material";
import WeatherWidget from '../Weather/WeatherWidget';
import InviteCodeForm from '../Invites/InviteCodeForm';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const [timeRange, setTimeRange] = useState("7");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleOpenInviteDialog = () => {
    setInviteDialogOpen(true);
  };

  const handleCloseInviteDialog = () => {
    setInviteDialogOpen(false);
  };
  
  const handleInviteSuccess = (data) => {
    console.log('Invite success:', data);
    setInviteSuccess(true);
    // Don't auto-close the dialog as user may need to complete payment
  };

  // Sample data for my tickets
  const myTickets = [
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      date: "March 15, 2024",
      time: "9:00 AM",
      location: "Tech Convention Center, San Francisco",
      ticketType: "VIP Access",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 2,
      title: "Summer Music Festival",
      date: "July 1-3, 2024",
      time: "All Day",
      location: "Riverside Park, New York",
      ticketType: "3-Day Pass",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    },
  ];

  // Sample data for recommended events
  const recommendedEvents = [
    {
      id: 3,
      title: "Modern Art Exhibition",
      date: "April 5, 2024",
      time: "6:00 PM",
      location: "City Art Gallery, Chicago",
      price: "$25",
      image: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 4,
      title: "Jazz Night Downtown",
      date: "April 15, 2024",
      time: "8:00 PM",
      location: "Blue Note Club, Miami",
      price: "$35",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 5,
      title: "Food & Wine Festival",
      date: "May 20, 2024",
      time: "12:00 PM - 8:00 PM",
      location: "Central Park, New York",
      price: "$45",
      image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    },
  ];

  // Personal stats data
  const personalStats = [
    {
      title: "My Events",
      value: "5",
      icon: <CalendarIcon />,
      color: "#e3f2fd",
      iconColor: "#1976d2",
    },
    {
      title: "Tickets Purchased",
      value: "8",
      icon: <TheatersIcon />,
      color: "#e8f5e9",
      iconColor: "#388e3c",
    },
    {
      title: "Total Spent",
      value: "$320",
      icon: <MoneyIcon />,
      color: "#ffebee",
      iconColor: "#d32f2f",
    },
    {
      title: "Friends Invited",
      value: "12",
      icon: <PeopleIcon />,
      color: "#fff8e1",
      iconColor: "#ffa000",
    },
  ];

  // Common card style for consistent visual enhancement
  const cardStyle = {
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.12)",
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        bgcolor: "#f9fafb",
      }}
    >
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: "auto",
            transition: "all 0.25s ease-in-out",
            ml: 0,
          }}
        >
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            mb: 3 
          }}>
            <Typography variant="h6" component="h2" fontWeight="bold">
              My Dashboard
            </Typography>
            <Button 
              variant="contained" 
              size="small" 
              color="secondary"
              startIcon={<InviteIcon />}
              onClick={handleOpenInviteDialog}
            >
              Enter Invite Code
            </Button>
          </Box>

          {/* Weather Overview Section */}
          <Paper sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <Box sx={{ mb: { xs: 2, md: 0 } }}>
                <Typography variant="h6" gutterBottom>
                  Weather for Your Upcoming Events
                </Typography>
                <Typography variant="body2">
                  Check the weather for your upcoming events to plan accordingly
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2
              }}>
                {myTickets.slice(0, 2).map((ticket) => (
                  <Box key={ticket.id} sx={{ 
                    minWidth: 200,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    p: 1,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
                  }}>
                    <Typography variant="subtitle2" noWrap>
                      {ticket.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <LocationIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" noWrap>
                        {ticket.location.split(',')[0]}
                      </Typography>
                    </Box>
                    <WeatherWidget location={ticket.location} compact={true} />
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>

          {/* Personal Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {personalStats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ ...cardStyle }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {stat.title}
                        </Typography>
                        <Typography variant="h4" component="div" fontWeight="bold">
                          {stat.value}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: stat.color,
                          borderRadius: "50%",
                          width: 48,
                          height: 48,
                          color: stat.iconColor,
                        }}
                      >
                        {stat.icon}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* My Tickets Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" component="h3" fontWeight="bold">
                My Tickets
              </Typography>
              <Button variant="outlined" size="small">
                View All
              </Button>
            </Box>
            <Grid container spacing={3}>
              {myTickets.map((ticket) => (
                <Grid item xs={12} md={6} key={ticket.id}>
                  <Card sx={{ ...cardStyle, display: "flex", flexDirection: { xs: "column", sm: "row" }, height: "100%" }}>
                    <CardMedia
                      component="img"
                      sx={{ width: { xs: "100%", sm: 140 }, height: { xs: 140, sm: "auto" } }}
                      image={ticket.image}
                      alt={ticket.title}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                        p: 3,
                      }}
                    >
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Typography variant="h6" component="div" fontWeight="bold" sx={{ mb: 1 }}>
                            {ticket.title}
                          </Typography>
                          <Chip
                            label={ticket.ticketType}
                            size="small"
                            color="primary"
                            sx={{ ml: 1, fontWeight: "bold" }}
                          />
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <CalendarIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            {ticket.date} • {ticket.time}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <LocationIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            {ticket.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <WeatherIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            <WeatherWidget location={ticket.location} compact={true} />
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ mt: "auto", display: "flex", justifyContent: "space-between" }}>
                        <Button size="small" variant="outlined">
                          View Details
                        </Button>
                        <Button size="small" variant="contained">
                          Download Ticket
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Recommended Events Section */}
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" component="h3" fontWeight="bold">
                Recommended For You
              </Typography>
              <Button variant="outlined" size="small">
                Browse All
              </Button>
            </Box>
            <Grid 
              container 
              spacing={3}
              sx={{
                justifyContent: 'space-between',
                '& > .MuiGrid-item': {
                  display: 'flex',
                  maxWidth: { xs: '100%', sm: '48%', md: '31%' },
                  flexBasis: { xs: '100%', sm: '48%', md: '31%' }
                }
              }}
            >
              {recommendedEvents.map((event) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  key={event.id}
                  sx={{
                    width: '100%',
                    flexGrow: 0
                  }}
                >
                  <Card 
                    sx={{ 
                      ...cardStyle,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      width: '100%'
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ 
                        height: 200,
                        width: '100%',
                        objectFit: 'cover'
                      }}
                      image={event.image}
                      alt={event.title}
                    />
                    <CardContent 
                      sx={{ 
                        p: 3,
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div" fontWeight="bold" sx={{ mb: 1 }}>
                          {event.title}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <CalendarIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            {event.date} • {event.time}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <LocationIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            {event.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <WeatherIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                          <WeatherWidget location={event.location} compact={true} />
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                          {event.price}
                        </Typography>
                        <Button variant="contained" size="small">
                          Get Tickets
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>

      {/* Invite Code Dialog */}
      <Dialog 
        open={inviteDialogOpen} 
        onClose={handleCloseInviteDialog} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Enter Invite Code</DialogTitle>
        <DialogContent>
          <InviteCodeForm 
            onSuccess={handleInviteSuccess} 
            user={user}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInviteDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Success snackbar */}
      <Snackbar 
        open={inviteSuccess} 
        autoHideDuration={6000} 
        onClose={() => setInviteSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setInviteSuccess(false)} severity="success">
          Invite code accepted! Event added to your account.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerDashboard;