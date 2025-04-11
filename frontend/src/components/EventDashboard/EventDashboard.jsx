// components/EventDashboard/EventDashboard.jsx
import { useState, useEffect } from "react";
import { Box, Container, Typography, Alert, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import SummaryCards from "./SummaryCards";
import UpcomingEvents from "./UpcomingEvents";
import AnalyticsChart from "./AnalyticsChart";
import useAuth from "../../hooks/useAuth";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";

const EventDashboard = () => {
  const [timeRange, setTimeRange] = useState("7");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // User role validation
  useEffect(() => {
    if (!user) {
      console.log('No authenticated user, redirecting to login');
      navigate('/signin');
      return;
    }
    
    if (user.role === 'admin') {
      console.log('Admin user accessing user dashboard, redirecting to admin dashboard');
      navigate('/admin');
      return;
    }
    
    console.log('User dashboard accessed by:', user.email);
  }, [user, navigate]);

  // If user is an admin, redirect to admin dashboard
  if (!user || user.role === 'admin') {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        p: 3
      }}>
        <Alert severity="info" sx={{ mb: 2, width: '100%', maxWidth: 500 }}>
          Redirecting to the appropriate dashboard for your role.
        </Alert>
      </Box>
    );
  }

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleCreateEvent = () => {
    navigate('/dashboard/create-event');
  };

  // Sample data for the chart
  const chartData = [
    { name: "Mon", registrations: 120, revenue: 150 },
    { name: "Tue", registrations: 130, revenue: 200 },
    { name: "Wed", registrations: 100, revenue: 130 },
    { name: "Thu", registrations: 130, revenue: 160 },
    { name: "Fri", registrations: 90, revenue: 110 },
    { name: "Sat", registrations: 220, revenue: 240 },
  ];

  // Sample events data
  const upcomingEvents = [
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      date: "March 15, 2024",
      time: "9:00 AM",
      registered: 200,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 2,
      title: "Summer Music Festival",
      date: "July 1-3, 2024",
      time: "All Day",
      registered: 1500,
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 3,
      title: "Modern Art Exhibition",
      date: "April 5, 2024",
      time: "6:00 PM",
      registered: 150,
      image: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" component="h2" fontWeight="bold">
              Dashboard
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreateEvent}
                sx={{
                  borderRadius: 28,
                  boxShadow: "0 4px 14px rgba(25, 118, 210, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
                  },
                }}
              >
                Create New Event
              </Button>
              <IconButton 
                onClick={handleBackToHome}
                sx={{ 
                  bgcolor: 'white', 
                  boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                  '&:hover': { bgcolor: '#e8eaf6' },
                }}
                aria-label="back to home"
              >
                <HomeIcon />
              </IconButton>
            </Box>
          </Box>

          <SummaryCards cardStyle={cardStyle} />
          <UpcomingEvents cardStyle={cardStyle} events={upcomingEvents} />
          <AnalyticsChart
            cardStyle={cardStyle}
            timeRange={timeRange}
            handleTimeRangeChange={handleTimeRangeChange}
            chartData={chartData}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EventDashboard;