import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Event as EventIcon, 
  LocationOn,
  CalendarMonth,
  ArrowForward
} from '@mui/icons-material';
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
    category: 'Workshop',
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
    category: 'Conference',
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
    category: 'Networking',
  },
  {
    id: 'jkl012',
    title: 'Photography Masterclass',
    description: 'Advanced techniques for portrait and landscape photography.',
    startDate: new Date(2025, 5, 5),
    endDate: new Date(2025, 5, 5),
    time: '1:00 PM - 5:00 PM',
    location: 'Creative Arts Studio',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 150,
    category: 'Workshop',
  },
  {
    id: 'mno345',
    title: 'Music Festival 2025',
    description: 'Three days of amazing live music performances.',
    startDate: new Date(2025, 5, 10),
    endDate: new Date(2025, 5, 12),
    time: '12:00 PM - 11:00 PM',
    location: 'Riverside Park',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 199,
    category: 'Festival',
  },
  {
    id: 'pqr678',
    title: 'Yoga Retreat Weekend',
    description: 'Relax and rejuvenate with yoga, meditation, and healthy food.',
    startDate: new Date(2025, 5, 15),
    endDate: new Date(2025, 5, 17),
    time: '9:00 AM - 6:00 PM',
    location: 'Mountain View Resort',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 350,
    category: 'Retreat',
  },
];

// Extract unique categories for the filter
const categories = [...new Set(sampleEvents.map(event => event.category))];

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
        <Box sx={{ display: 'flex', gap: 1 }}>
          {event.category && (
            <Chip 
              label={event.category} 
              size="small" 
              color="secondary"
            />
          )}
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
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const eventsPerPage = 6;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:5001/api/events');
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events. Using sample data instead.');
        // Use sample data if the API call fails
        setEvents(sampleEvents);
        setFilteredEvents(sampleEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Filter events based on search query and category
    const filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === '' || event.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredEvents(filtered);
    setPage(1); // Reset to first page when filters change
  }, [searchQuery, categoryFilter, events]);

  // Calculate pagination
  const indexOfLastEvent = page * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Explore Events
      </Typography>
      
      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <TextField
          fullWidth
          label="Search events"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: { xs: '100%', md: 200 } }}>
          <InputLabel id="category-filter-label">Category</InputLabel>
          <Select
            labelId="category-filter-label"
            id="category-filter"
            value={categoryFilter}
            label="Category"
            onChange={handleCategoryChange}
          >
            <MenuItem value="">
              <em>All Categories</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {/* Error message */}
      {error && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {/* Loading indicator */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Event count */}
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
          </Typography>
          
          {/* Event grid */}
          {filteredEvents.length > 0 ? (
            <Grid container spacing={4}>
              {currentEvents.map((event) => (
                <Grid item key={event.id} xs={12} sm={6} md={4}>
                  <EventCard event={event} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <EventIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No events found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your search or filter criteria.
              </Typography>
            </Box>
          )}
          
          {/* Pagination */}
          {filteredEvents.length > eventsPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default EventsPage; 