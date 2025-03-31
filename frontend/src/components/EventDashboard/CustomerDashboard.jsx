// components/CustomerDashboard/CustomerDashboard.jsx
import { useState } from "react";
import { Box, Typography, Button, Card, CardContent, CardMedia, Grid, Chip } from "@mui/material";
import Sidebar from "../EventDashboard/CustSidebar";
import Header from "../EventDashboard/Header";
import { CalendarToday as CalendarIcon, People as PeopleIcon, Theaters as TheatersIcon, AttachMoney as MoneyIcon } from "@mui/icons-material";

const CustomerDashboard = () => {
  const [timeRange, setTimeRange] = useState("7");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Sample data for my tickets
  const myTickets = [
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      date: "March 15, 2024",
      time: "9:00 AM",
      location: "Tech Convention Center",
      ticketType: "VIP Access",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 2,
      title: "Summer Music Festival",
      date: "July 1-3, 2024",
      time: "All Day",
      location: "Riverside Park",
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
      location: "City Art Gallery",
      price: "$25",
      image: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 4,
      title: "Jazz Night Downtown",
      date: "April 15, 2024",
      time: "8:00 PM",
      location: "Blue Note Club",
      price: "$35",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 5,
      title: "Food & Wine Festival",
      date: "May 20, 2024",
      time: "12:00 PM - 8:00 PM",
      location: "Central Park",
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
          <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
            My Dashboard
          </Typography>

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
                    <CardContent sx={{ flex: "1 0 auto", p: 3 }}>
                      <Typography variant="h6" component="div" fontWeight="bold">
                        {ticket.title}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1, mt: 1 }}>
                        <CalendarIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {ticket.date} • {ticket.time}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {ticket.location}
                      </Typography>
                      <Chip
                        label={ticket.ticketType}
                        size="small"
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          fontWeight: "medium",
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Recommended Events Section with space-between justification */}
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
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {event.location}
                        </Typography>
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
    </Box>
  );
};

export default CustomerDashboard;