import React, { useState, useContext, useEffect } from 'react';
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
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
  Autocomplete
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ImageIcon from '@mui/icons-material/Image';
import PlaceIcon from '@mui/icons-material/Place';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// Available time slots
const TIME_SLOTS = [
  '8:00 AM - 10:00 AM',
  '10:30 AM - 12:30 PM',
  '1:00 PM - 3:00 PM',
  '3:30 PM - 5:30 PM',
  '6:00 PM - 8:00 PM',
  '8:30 PM - 10:30 PM',
  'Full Day (9:00 AM - 5:00 PM)',
  'Evening (6:00 PM - 12:00 AM)'
];

// Google Maps API key - replace with your actual key
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '8px'
};

// Default center for the map (New York City)
const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

const CreateEventForm = ({ venues = [] }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [useCustomLocation, setUseCustomLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [marker, setMarker] = useState(null);
  const [customAddress, setCustomAddress] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: null,
    endDate: null,
    timeSlot: '',
    location: '',
    venueId: '',
    capacity: '',
    price: '',
    banner: null,
    requiredServices: [],
    status: 'draft'
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

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

  // Update selected venue when venueId changes
  useEffect(() => {
    if (formData.venueId && venues.length > 0) {
      const venue = venues.find(v => v.id === formData.venueId);
      setSelectedVenue(venue);
      if (venue) {
        setFormData(prev => ({
          ...prev,
          location: venue.location
        }));
      }
    } else {
      setSelectedVenue(null);
    }
  }, [formData.venueId, venues]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for capacity to validate against venue capacity
    if (name === 'capacity' && selectedVenue) {
      const capacityValue = parseInt(value);
      if (!isNaN(capacityValue) && capacityValue > selectedVenue.capacity) {
        setErrors({
          ...errors,
          capacity: `Capacity exceeds venue limit of ${selectedVenue.capacity} people`
        });
      } else {
        // Clear capacity error if it's within limits
        const newErrors = { ...errors };
        delete newErrors.capacity;
        setErrors(newErrors);
      }
    }
    
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

  const handleLocationTypeChange = (e) => {
    const useCustom = e.target.value === 'custom';
    setUseCustomLocation(useCustom);
    
    if (!useCustom) {
      // If switching to venue selection, clear custom location data
      setCustomAddress('');
      setMarker(null);
      setFormData(prev => ({
        ...prev,
        location: selectedVenue ? selectedVenue.location : ''
      }));
    } else {
      // If switching to custom location, clear venue selection
      setFormData(prev => ({
        ...prev,
        venueId: ''
      }));
      setSelectedVenue(null);
    }
  };

  const handleMapClick = (e) => {
    const newMarker = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    setMarker(newMarker);
    
    // Get address from coordinates using reverse geocoding
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: newMarker }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const address = results[0].formatted_address;
        setCustomAddress(address);
        setFormData(prev => ({
          ...prev,
          location: address
        }));
      }
    });
  };

  const handleAddressSearch = (address) => {
    if (!address) return;
    
    // Get coordinates from address using geocoding
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const newMarker = {
          lat: location.lat(),
          lng: location.lng()
        };
        setMarker(newMarker);
        setMapCenter(newMarker);
        setFormData(prev => ({
          ...prev,
          location: address
        }));
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.timeSlot) newErrors.timeSlot = 'Time slot is required';
    
    // Check for either venue or custom location
    if (!useCustomLocation && !formData.venueId) {
      newErrors.venueId = 'Please select a venue';
    }
    
    if (useCustomLocation && !formData.location) {
      newErrors.location = 'Please select a location on the map';
    }
    
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (formData.capacity) {
      if (isNaN(formData.capacity) || parseInt(formData.capacity) <= 0) {
        newErrors.capacity = 'Capacity must be a positive number';
      } else if (selectedVenue && parseInt(formData.capacity) > selectedVenue.capacity) {
        newErrors.capacity = `Capacity exceeds venue limit of ${selectedVenue.capacity} people`;
      }
    } else {
      newErrors.capacity = 'Capacity is required';
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
    
    try {
      const response = await axios.post(
        'http://localhost:5001/api/events',
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${user.token}`
          }
        }
      );
      
      showToast('Event created successfully!');
      
      // Redirect to events page after successful creation
      setTimeout(() => {
        navigate('/dashboard/home');
      }, 1500);
      
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

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}
      >
        <Grid container spacing={3}>
          {/* Basic Information Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium', color: '#3f51b5' }}>
              Basic Information
            </Typography>
          </Grid>
          
          {/* Event Title */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Event Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              variant="outlined"
              error={!!errors.title}
              helperText={errors.title}
              required
              placeholder="Enter a descriptive title for your event"
            />
          </Grid>
          
          {/* Event Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Event Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              variant="outlined"
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description}
              required
              placeholder="Tell attendees what your event is about"
            />
          </Grid>
          
          {/* Event Type */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Event Type</InputLabel>
              <Select
                label="Event Type"
                name="type"
                value={formData.type || ''}
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
          
          {/* Event Status */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Event Status</InputLabel>
              <Select
                label="Event Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Venue & Location Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: 'medium', color: '#3f51b5' }}>
              Venue & Location
            </Typography>
          </Grid>
          
          {/* Location Type Selection */}
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                name="locationType"
                value={useCustomLocation ? 'custom' : 'venue'}
                onChange={handleLocationTypeChange}
              >
                <FormControlLabel 
                  value="venue" 
                  control={<Radio />} 
                  label="Select from available venues" 
                />
                <FormControlLabel 
                  value="custom" 
                  control={<Radio />} 
                  label="Use custom location" 
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          
          {/* Venue Selection */}
          {!useCustomLocation && (
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" error={!!errors.venueId}>
                <InputLabel>Select Venue</InputLabel>
                <Select
                  label="Select Venue"
                  name="venueId"
                  value={formData.venueId}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">
                    <em>Select a venue</em>
                  </MenuItem>
                  {venues.map((venue) => (
                    <MenuItem key={venue.id} value={venue.id}>
                      {venue.name} - Capacity: {venue.capacity}
                    </MenuItem>
                  ))}
                </Select>
                {errors.venueId && (
                  <FormHelperText error>{errors.venueId}</FormHelperText>
                )}
              </FormControl>
              
              {selectedVenue && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Venue Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Location:</strong> {selectedVenue.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Capacity:</strong> {selectedVenue.capacity} people
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Price per person:</strong> ${selectedVenue.pricePerPerson}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Services:</strong> {selectedVenue.services?.join(', ')}
                  </Typography>
                </Box>
              )}
            </Grid>
          )}
          
          {/* Custom Location with Map */}
          {useCustomLocation && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Select Location on Map or Search Address
              </Typography>
              
              <Autocomplete
                freeSolo
                options={[]}
                inputValue={customAddress}
                onInputChange={(event, newValue) => {
                  setCustomAddress(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Address"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={!!errors.location}
                    helperText={errors.location}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <PlaceIcon color="action" sx={{ mr: 1 }} />
                    }}
                  />
                )}
              />
              
              <Box sx={{ mt: 2, mb: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => handleAddressSearch(customAddress)}
                  disabled={!customAddress}
                >
                  Search Location
                </Button>
              </Box>
              
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={14}
                  onClick={handleMapClick}
                >
                  {marker && <Marker position={marker} />}
                </GoogleMap>
              </LoadScript>
              
              {formData.location && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected location: {formData.location}
                </Typography>
              )}
            </Grid>
          )}
          
          {/* Date & Time Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: 'medium', color: '#3f51b5' }}>
              Date & Time
            </Typography>
          </Grid>
          
          {/* Start Date */}
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
                    variant="outlined"
                    error={!!errors.startDate}
                    helperText={errors.startDate}
                    required
                    InputProps={{
                      startAdornment: <CalendarTodayIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          
          {/* End Date */}
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
                    variant="outlined"
                    error={!!errors.endDate}
                    helperText={errors.endDate}
                    required
                    InputProps={{
                      startAdornment: <CalendarTodayIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          
          {/* Time Slot */}
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" error={!!errors.timeSlot}>
              <InputLabel>Time Slot</InputLabel>
              <Select
                label="Time Slot"
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="">
                  <em>Select a time slot</em>
                </MenuItem>
                {TIME_SLOTS.map((slot) => (
                  <MenuItem key={slot} value={slot}>
                    {slot}
                  </MenuItem>
                ))}
              </Select>
              {errors.timeSlot && <FormHelperText>{errors.timeSlot}</FormHelperText>}
            </FormControl>
          </Grid>
          
          {/* Capacity */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleInputChange}
              variant="outlined"
              error={!!errors.capacity}
              helperText={errors.capacity}
              required
              placeholder="Maximum number of attendees"
              InputProps={{
                startAdornment: <PeopleIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
            {selectedVenue && (
              <Typography variant="caption" color={parseInt(formData.capacity) > selectedVenue.capacity ? "error" : "text.secondary"}>
                Selected venue capacity: {selectedVenue.capacity} people
              </Typography>
            )}
          </Grid>
          
          {/* Additional Details Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: 'medium', color: '#3f51b5' }}>
              Additional Details
            </Typography>
          </Grid>
          
          {/* Event Price */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              variant="outlined"
              error={!!errors.price}
              helperText={errors.price}
              placeholder="Leave empty for free events"
              InputProps={{
                startAdornment: <AttachMoneyIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Grid>
          
          {/* Required Services */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Required Services</InputLabel>
              <Select
                multiple
                label="Required Services"
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
          
          {/* Banner Upload */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Event Banner Image
            </Typography>
            <Box
              sx={{
                border: '1px dashed #ccc',
                borderRadius: 1,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 2,
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
                  Upload Image
                </Button>
              </label>
              
              {previewImage && (
                <Box sx={{ mt: 2, width: '100%', maxHeight: 200, overflow: 'hidden' }}>
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    style={{ width: '100%', objectFit: 'cover', borderRadius: 4 }}
                  />
                </Box>
              )}
              
              {errors.banner && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.banner}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
        
        {/* Submit and Cancel Buttons */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{ px: 4 }}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ 
              px: 4,
              position: 'relative',
              boxShadow: '0 4px 10px rgba(63, 81, 181, 0.2)',
              '&:hover': {
                boxShadow: '0 6px 15px rgba(63, 81, 181, 0.3)',
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Create Event'
            )}
          </Button>
        </Box>
      </Paper>
      
      {/* Toast Notification */}
      <Snackbar 
        open={toast.open} 
        autoHideDuration={6000} 
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleToastClose} 
          severity={toast.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateEventForm; 