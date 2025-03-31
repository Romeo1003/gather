import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Fab,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Badge,
  Avatar
} from "@mui/material";
import {
  Search as SearchIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  Add as AddIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  Close as CloseIcon
} from "@mui/icons-material";

const EventsPage = () => {
  const [status, setStatus] = useState("All Status");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);

  // Sample events with Unsplash images
  const sampleEvents = [
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      date: "March 15, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Tech Convention Center, San Francisco",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Annual technology conference featuring the latest innovations in the tech industry. Join industry leaders, innovators, and tech enthusiasts for a day of inspiring talks, hands-on workshops, and networking opportunities. Explore emerging technologies including AI, blockchain, and IoT.",
      price: 299,
      accessType: "VIP Access",
      featured: true,
      attendees: 1250,
      category: "Technology"
    },
    {
      id: 2,
      title: "Digital Marketing Conference",
      date: "April 5, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Business Center Downtown, New York",
      image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Learn the latest digital marketing strategies from industry experts. This conference covers SEO, social media marketing, content creation, and analytics. Perfect for marketing professionals looking to stay ahead of the curve.",
      price: 199,
      accessType: "Standard Access",
      featured: false,
      attendees: 875,
      category: "Marketing"
    },
    {
      id: 3,
      title: "Startup Pitch Competition",
      date: "May 20, 2024",
      time: "2:00 PM - 7:00 PM",
      location: "Innovation Hub, Austin",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Watch startups pitch their ideas to venture capitalists and angel investors. This is a great opportunity for entrepreneurs to showcase their innovations and for investors to discover the next big thing.",
      price: 0,
      accessType: "Free Entry",
      featured: true,
      attendees: 450,
      category: "Business"
    },
    {
      id: 4,
      title: "Web Development Workshop",
      date: "June 10, 2024",
      time: "9:00 AM - 3:00 PM",
      location: "Tech Campus, Seattle",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Hands-on workshop for modern web development techniques. Learn about the latest frameworks, tools, and best practices in web development. This workshop is suitable for beginners and intermediate developers.",
      price: 149,
      accessType: "Premium Access",
      featured: false,
      attendees: 120,
      category: "Development"
    },
    {
      id: 5,
      title: "Data Science Symposium",
      date: "July 8, 2024",
      time: "10:00 AM - 6:00 PM",
      location: "University Research Center, Boston",
      image: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Deep dive into data science methodologies, machine learning algorithms, and real-world applications. Connect with leading researchers and practitioners in the field of data science.",
      price: 249,
      accessType: "Professional Pass",
      featured: true,
      attendees: 580,
      category: "Data Science"
    },
    {
      id: 6,
      title: "UX/UI Design Conference",
      date: "August 15, 2024",
      time: "9:30 AM - 4:30 PM",
      location: "Design Studio, Portland",
      image: "https://images.unsplash.com/photo-1508921340878-ba53e1f016ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Explore the latest trends in user experience and interface design. This conference features workshops, case studies, and networking opportunities for designers at all career stages.",
      price: 179,
      accessType: "Designer Pass",
      featured: false,
      attendees: 350,
      category: "Design"
    },
    {
      id: 7,
      title: "Cybersecurity Forum",
      date: "September 22, 2024",
      time: "8:00 AM - 5:00 PM",
      location: "Security Center, Washington DC",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Join cybersecurity experts to discuss the latest threats, defense strategies, and industry best practices. This forum includes hands-on training sessions and panel discussions.",
      price: 299,
      accessType: "Security Clearance",
      featured: true,
      attendees: 420,
      category: "Security"
    },
    {
      id: 8,
      title: "AI and Ethics Symposium",
      date: "October 5, 2024",
      time: "10:00 AM - 6:00 PM",
      location: "Philosophy Center, Chicago",
      image: "https://images.unsplash.com/photo-1527430253228-e93688616381?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Explore the ethical implications of artificial intelligence and machine learning. Join philosophers, technologists, and policymakers in discussing responsible AI development.",
      price: 120,
      accessType: "General Admission",
      featured: false,
      attendees: 280,
      category: "Ethics"
    }
  ];

  useEffect(() => {
    // Load events
    setEvents(sampleEvents);
  }, []);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleView = (event) => {
    setSelectedEvent(event);
    setViewModalOpen(true);
  };

  const handleCreateNew = () => {
    console.log("Create new event");
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !selectedDate || event.date === selectedDate;

    const matchesStatus =
      status === "All Status" ||
      (status === "Upcoming" && new Date(event.date) > new Date()) ||
      (status === "Past" && new Date(event.date) <= new Date()) ||
      (status === "Featured" && event.featured);

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        bgcolor: "#f9fafb",
      }}
    >
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          overflow: "auto",
          position: "relative",
        }}
      >
        {/* <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Discover Events
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 8,
              textTransform: "none",
              px: 3,
              py: 1,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
            onClick={handleCreateNew}
          >
            Create Event
          </Button>
        </Box> */}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 4,
            flexWrap: "wrap",
          }}
        >
          <TextField
            placeholder="Search events..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flexGrow: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 8,
                bgcolor: "#ffffff",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
          <FormControl 
            sx={{ 
              minWidth: 150,
              "& .MuiOutlinedInput-root": {
                borderRadius: 8,
                bgcolor: "#ffffff",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              },
            }}
          >
            {/* <Select
              value={status}
              onChange={handleStatusChange}
              displayEmpty
              sx={{
                height: "100%",
              }}
            >
              <MenuItem value="All Status">All Status</MenuItem>
              <MenuItem value="Upcoming">Upcoming</MenuItem>
              <MenuItem value="Past">Past</MenuItem>
              <MenuItem value="Featured">Featured</MenuItem>
            </Select> */}
          </FormControl>
          <TextField
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            sx={{
              width: 160,
              "& .MuiOutlinedInput-root": {
                borderRadius: 8,
                bgcolor: "#ffffff",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              },
            }}
            InputProps={{
              sx: {
                height: "100%",
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
            {filteredEvents.filter(e => e.featured).length > 0 ? "Featured Events" : "Popular Events"}
          </Typography>
          <Grid container spacing={3}>
            {filteredEvents.filter(e => e.featured).slice(0, 3).map((event) => (
              <Grid item xs={12} md={4} key={`featured-${event.id}`}>
                <Card 
                  sx={{ 
                    borderRadius: 4, 
                    overflow: "hidden", 
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
                    }
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={event.image}
                      alt={event.title}
                    />
                    <Chip 
                      icon={<StarIcon fontSize="small" />}
                      label="Featured"
                      sx={{ 
                        position: "absolute", 
                        top: 12, 
                        right: 12,
                        bgcolor: "primary.main",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                    <Chip 
                      label={event.category}
                      sx={{ 
                        position: "absolute", 
                        bottom: -12, 
                        left: 12,
                        bgcolor: "white",
                        fontWeight: "medium",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </Box>
                  <CardContent sx={{ pb: 1, flexGrow: 1 }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {event.title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <CalendarIcon 
                        fontSize="small" 
                        sx={{ color: "primary.main", mr: 0.5 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {event.date}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <TimeIcon 
                        fontSize="small" 
                        sx={{ color: "primary.main", mr: 0.5 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {event.time}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LocationIcon 
                        fontSize="small" 
                        sx={{ color: "primary.main", mr: 0.5 }}
                      />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {event.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <PeopleIcon 
                        fontSize="small" 
                        sx={{ color: "primary.main", mr: 0.5 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {event.attendees.toLocaleString()} attendees
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: "space-between" }}>
                    <Typography 
                      variant="subtitle1" 
                      fontWeight="bold" 
                      color="primary"
                    >
                      {event.price ? `$${event.price}` : "Free"}
                    </Typography>
                    <Button
                      variant="contained"
                      size="medium"
                      sx={{ 
                        borderRadius: 8,
                        textTransform: "none", 
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        px: 3
                      }}
                      onClick={() => handleView(event)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
          All Events
        </Typography>
        <Grid container spacing={3}>
          {filteredEvents.map((event) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
              <Card 
                sx={{ 
                  borderRadius: 4, 
                  overflow: "hidden", 
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
                  }
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={event.image}
                    alt={event.title}
                  />
                  {event.featured && (
                    <StarIcon 
                      sx={{ 
                        position: "absolute", 
                        top: 8, 
                        right: 8,
                        color: "primary.main",
                        bgcolor: "white",
                        borderRadius: "50%",
                        p: 0.5,
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  )}
                  <Chip 
                    label={event.category}
                    size="small"
                    sx={{ 
                      position: "absolute", 
                      bottom: -10, 
                      left: 12,
                      bgcolor: "white",
                      fontWeight: "medium",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </Box>
                <CardContent sx={{ pb: 1, flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium" component="div" gutterBottom noWrap>
                    {event.title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CalendarIcon 
                      fontSize="small" 
                      sx={{ color: "primary.main", mr: 0.5 }}
                    />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {event.date}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationIcon 
                      fontSize="small" 
                      sx={{ color: "primary.main", mr: 0.5 }}
                    />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {event.location.split(',')[0]}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: "space-between" }}>
                  <Typography 
                    variant="subtitle2" 
                    fontWeight="bold" 
                    color="primary.dark"
                  >
                    {event.price ? `$${event.price}` : "Free"}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ 
                      borderRadius: 8,
                      textTransform: "none",
                      borderColor: "primary.main",
                      "&:hover": {
                        borderColor: "primary.dark",
                        bgcolor: "rgba(0, 0, 0, 0.02)",
                      },
                    }}
                    onClick={() => handleView(event)}
                  >
                    Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Floating Action Button for mobile */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            display: { xs: 'flex', md: 'none' },
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          }}
          onClick={handleCreateNew}
        >
          <AddIcon />
        </Fab>

        {/* View Event Modal */}
        <Dialog
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="bold">Event Details</Typography>
              <IconButton 
                onClick={() => setViewModalOpen(false)}
                sx={{ 
                  bgcolor: "rgba(0, 0, 0, 0.05)",
                  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.1)" },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedEvent && (
              <Box>
                <Box 
                  sx={{ 
                    borderRadius: 3, 
                    overflow: "hidden", 
                    mb: 3,
                    maxHeight: "300px",
                    position: "relative"
                  }}
                >
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    style={{ width: "100%", objectFit: "cover" }}
                  />
                  <Box 
                    sx={{ 
                      position: "absolute", 
                      bottom: 16, 
                      left: 16, 
                      right: 16,
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <Chip 
                      label={selectedEvent.category}
                      sx={{ 
                        bgcolor: "white",
                        fontWeight: "bold",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                      }}
                    />
                    {selectedEvent.featured && (
                      <Chip 
                        icon={<StarIcon fontSize="small" />}
                        label="Featured"
                        sx={{ 
                          bgcolor: "primary.main",
                          color: "white",
                          fontWeight: "bold",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                        }}
                      />
                    )}
                  </Box>
                </Box>
                <Typography variant="h4" gutterBottom fontWeight="medium">
                  {selectedEvent.title}
                </Typography>
                
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      {selectedEvent.description}
                    </Typography>
                    
                    <Typography variant="h6" gutterBottom fontWeight="medium">
                      Event Details
                    </Typography>
                    
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar sx={{ bgcolor: "primary.light", mr: 2 }}>
                        <CalendarIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Date and Time
                        </Typography>
                        <Typography variant="body1">
                          {selectedEvent.date} • {selectedEvent.time}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar sx={{ bgcolor: "primary.light", mr: 2 }}>
                        <LocationIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Location
                        </Typography>
                        <Typography variant="body1">
                          {selectedEvent.location}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar sx={{ bgcolor: "primary.light", mr: 2 }}>
                        <PeopleIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Attendees
                        </Typography>
                        <Typography variant="body1">
                          {selectedEvent.attendees.toLocaleString()} registered attendees
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card 
                      elevation={0} 
                      sx={{ 
                        border: "1px solid", 
                        borderColor: "divider",
                        borderRadius: 3,
                        p: 2,
                      }}
                    >
                      <Typography variant="h6" gutterBottom fontWeight="medium">
                        Registration
                      </Typography>
                      
                      <Typography variant="h4" color="primary.main" fontWeight="bold" sx={{ mb: 2 }}>
                        {selectedEvent.price ? `$${selectedEvent.price}` : "Free"}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {selectedEvent.accessType}
                      </Typography>
                      
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
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default EventsPage;