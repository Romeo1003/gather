import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip,
  Snackbar, 
  Alert, 
  CircularProgress,
  FormControlLabel,
  Switch
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ImageIcon from '@mui/icons-material/Image';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import axios from 'axios';

const AdminEventForm = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: null,
    endDate: null,
    time: '',
    location: '',
    capacity: '',
    price: '',
    banner: null,
    requiredServices: [],
    status: 'published',  // Default to published for admin
    featuredEvent: false,
    highlightColor: '#3f51b5',
    venueName: '',
    venueId: ''
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [venueSearchResults, setVenueSearchResults] = useState([]);

  // Event type options for dropdown
  const eventTypes = [
    'Birthday Party',
    'Wedding',
    'Corporate Event',
    'Conference',
    'Anniversary',
    'Graduation',
    'Holiday Party',
    'Fundraiser',
    'Other'
  ];

  // Event status options (admin only)
  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'featured', label: 'Featured' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Service options that can be selected
  const serviceOptions = [
    'Catering',
    'Photography',
    'Videography',
    'Music/DJ',
    'Decoration',
    'Transportation',
    'Event Staff',
    'Security'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleDateChange = (field, date) => {
    setFormData({
      ...formData,
      [field]: date
    });
    
    // Clear error for this field
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };

  const handleServiceChange = (e) => {
    setFormData({
      ...formData,
      requiredServices: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        banner: file
      });
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error for image if exists
      if (errors.banner) {
        setErrors({
          ...errors,
          banner: null
        });
      }
    }
  };

  const searchVenues = async (query) => {
    if (!query || query.length < 2) {
      setVenueSearchResults([]);
      return;
    }
    
    try {
      const response = await axios.get(`http://localhost:5001/api/venues/search?q=${query}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      setVenueSearchResults(response.data);
    } catch (error) {
      console.error('Error searching venues:', error);
      showToast('Failed to search venues', 'error');
    }
  };

  const handleVenueSearch = (e) => {
    const query = e.target.value;
    setFormData({
      ...formData,
      venueName: query
    });
    
    // Debounce the search
    clearTimeout(window.venueSearchTimeout);
    window.venueSearchTimeout = setTimeout(() => {
      searchVenues(query);
    }, 300);
  };

  const handleVenueSelect = (venue) => {
    setFormData({
      ...formData,
      venueId: venue.id,
      venueName: venue.name,
      location: venue.address || formData.location
    });
    setVenueSearchResults([]);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (formData.capacity && (isNaN(formData.capacity) || parseInt(formData.capacity) <= 0)) {
      newErrors.capacity = 'Capacity must be a positive number';
    }
    
    if (formData.price && (isNaN(formData.price) || parseFloat(formData.price) < 0)) {
      newErrors.price = 'Price must be a non-negative number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (message, severity = 'success') => {
    setToast({
      open: true,
      message,
      severity
    });
  };

  const handleToastClose = () => {
    setToast({
      ...toast,
      open: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please correct the errors in the form', 'error');
      return;
    }
    
    setLoading(true);
    
    // Create FormData object for file upload
    const submitData = new FormData();
    
    // Append all form fields
    Object.keys(formData).forEach(key => {
      if (key === 'banner') {
        if (formData.banner) {
          submitData.append('banner', formData.banner);
        }
      } else if (key === 'requiredServices') {
        submitData.append('requiredServices', JSON.stringify(formData.requiredServices));
      } else if (formData[key] !== null && formData[key] !== undefined) {
        submitData.append(key, formData[key]);
      }
    });
    
    // Add organizer email - for admin this will be the admin's email
    submitData.append('organizerEmail', user.email);
    
    try {
      // Send the request to create the event
      const response = await axios.post('http://localhost:5001/api/events', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        }
      });
      
      showToast('Event created successfully!', 'success');
      
      // Navigate to admin events panel after a delay
      setTimeout(() => {
        navigate('/admin/events');
      }, 2000);
    } catch (error) {
      console.error('Error creating event:', error);
      showToast(
        error.response?.data?.message || 'Failed to create event. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/events');
  };

  return (
    <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Title */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <VerifiedUserIcon sx={{ mr: 1, color: '#3f51b5' }} />
              Admin Event Creation
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              As an administrator, you can create events that are immediately published without approval.
            </Typography>
          </Grid>

          {/* Event Title */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Event Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              error={!!errors.title}
              helperText={errors.title}
              variant="outlined"
            />
          </Grid>

          {/* Event Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label="Event Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              error={!!errors.description}
              helperText={errors.description}
              variant="outlined"
            />
          </Grid>

          {/* Event Dates */}
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(date) => handleDateChange('startDate', date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    error={!!errors.startDate}
                    helperText={errors.startDate}
                    InputProps={{
                      startAdornment: (
                        <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                      ),
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(date) => handleDateChange('endDate', date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    error={!!errors.endDate}
                    helperText={errors.endDate}
                    InputProps={{
                      startAdornment: (
                        <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                      ),
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          {/* Time */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Event Time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              placeholder="e.g., 18:00 - 22:00"
              InputProps={{
                startAdornment: (
                  <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                ),
              }}
            />
          </Grid>

          {/* Capacity */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              error={!!errors.capacity}
              helperText={errors.capacity}
              InputProps={{
                startAdornment: (
                  <PeopleIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                ),
              }}
            />
          </Grid>

          {/* Price */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Price ($)"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              error={!!errors.price}
              helperText={errors.price}
              InputProps={{
                startAdornment: (
                  <AttachMoneyIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                ),
              }}
            />
          </Grid>

          {/* Venue Search - Admin Only */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search Venue"
              name="venueName"
              value={formData.venueName}
              onChange={handleVenueSearch}
              placeholder="Start typing to search venues"
              InputProps={{
                startAdornment: (
                  <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                ),
              }}
            />
            {venueSearchResults.length > 0 && (
              <Paper elevation={3} sx={{ mt: 1, p: 1, maxHeight: 200, overflow: 'auto' }}>
                {venueSearchResults.map(venue => (
                  <Box 
                    key={venue.id} 
                    sx={{ 
                      p: 1, 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' } 
                    }}
                    onClick={() => handleVenueSelect(venue)}
                  >
                    <Typography variant="body2">{venue.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{venue.address}</Typography>
                  </Box>
                ))}
              </Paper>
            )}
          </Grid>

          {/* Location */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              error={!!errors.location}
              helperText={errors.location}
              InputProps={{
                startAdornment: (
                  <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                ),
              }}
            />
          </Grid>

          {/* Event Type */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                name="eventType"
                value={formData.eventType || ''}
                onChange={handleInputChange}
              >
                {eventTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Event Status - Admin Only */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Publication Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Required Services */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Required Services</InputLabel>
              <Select
                multiple
                name="requiredServices"
                value={formData.requiredServices}
                onChange={handleServiceChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {serviceOptions.map((service) => (
                  <MenuItem key={service} value={service}>
                    {service}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Featured Event Switch - Admin Only */}
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.featuredEvent}
                  onChange={handleSwitchChange}
                  name="featuredEvent"
                  color="primary"
                />
              }
              label="Featured Event"
            />
          </Grid>

          {/* Banner Image */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Event Banner
            </Typography>
            <Box
              sx={{
                border: '1px dashed',
                borderColor: errors.banner ? 'error.main' : 'divider',
                borderRadius: 1,
                p: 2,
                mb: 2,
                textAlign: 'center',
              }}
            >
              <input
                accept="image/*"
                id="banner-upload"
                type="file"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="banner-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<ImageIcon />}
                >
                  Upload Banner Image
                </Button>
              </label>
              {errors.banner && (
                <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                  {errors.banner}
                </Typography>
              )}
            </Box>
            {previewImage && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={previewImage}
                  alt="Banner preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    borderRadius: 4,
                  }}
                />
              </Box>
            )}
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Creating Event...' : 'Create Event'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Snackbar open={toast.open} autoHideDuration={6000} onClose={handleToastClose}>
        <Alert onClose={handleToastClose} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AdminEventForm; 