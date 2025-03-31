import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const EventModal = ({ open, onClose, onSave, event, onChange, isEdit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    title: false,
    description: false,
    startDate: false,
    endDate: false,
    location: false
  });

  // Initialize dates when modal opens
  useEffect(() => {
    if (open) {
      setError(null);
      // If we have a date but no startDate/endDate, split it
      if (event.date && !event.startDate && !event.endDate) {
        const date = new Date(event.date);
        onChange('startDate', date);
        onChange('endDate', new Date(date.getTime() + 2 * 60 * 60 * 1000)); // Default 2 hour duration
      }
    }
  }, [open, event.date, event.startDate, event.endDate, onChange]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      onChange('banner', file);
    }
  };

  const validateFields = () => {
    const errors = {
      title: !event.title,
      description: !event.description,
      startDate: !event.startDate,
      endDate: !event.endDate,
      location: !event.location
    };

    setFieldErrors(errors);
    return Object.values(errors).some(error => error);
  };

  const validateDates = () => {
    if (!event.startDate || !event.endDate) return false;

    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (start >= end) {
      setError('End date must be after start date');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setError(null);

    // Validate required fields
    if (validateFields()) {
      setError('Please fill all required fields');
      return;
    }

    // Validate date logic
    if (!validateDates()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare the data to send
      const eventData = {
        title: event.title,
        description: event.description,
        startDate: event.startDate.toISOString(),
        endDate: event.endDate.toISOString(),
        time: event.time || null,
        location: event.location,
        price: event.price ? parseFloat(event.price) : 0,
        ...(event.banner && { banner: event.banner }),
        ...(event.image && { image: event.image })
      };

      await onSave(eventData);
      onClose();
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {isEdit ? 'Edit Event' : 'Create New Event'}
          <IconButton onClick={onClose} disabled={isLoading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Event Title *"
              placeholder="Enter event title"
              fullWidth
              value={event.title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              error={fieldErrors.title}
              helperText={fieldErrors.title ? 'This field is required' : ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Event Description *"
              placeholder="Describe your event"
              fullWidth
              multiline
              rows={4}
              value={event.description || ''}
              onChange={(e) => onChange('description', e.target.value)}
              error={fieldErrors.description}
              helperText={fieldErrors.description ? 'This field is required' : ''}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Start Date & Time *"
                value={event.startDate || null}
                onChange={(value) => onChange('startDate', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={fieldErrors.startDate}
                    helperText={fieldErrors.startDate ? 'This field is required' : ''}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="End Date & Time *"
                value={event.endDate || null}
                onChange={(value) => onChange('endDate', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={fieldErrors.endDate}
                    helperText={fieldErrors.endDate ? 'This field is required' : ''}
                  />
                )}
                minDateTime={event.startDate || null}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Venue Location *"
              placeholder="Enter venue address"
              fullWidth
              value={event.location || ''}
              onChange={(e) => onChange('location', e.target.value)}
              error={fieldErrors.location}
              helperText={fieldErrors.location ? 'This field is required' : ''}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <LocationIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Price ($)"
              type="number"
              placeholder="0.00"
              fullWidth
              value={event.price || ''}
              onChange={(e) => onChange('price', e.target.value)}
              InputProps={{
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Time Display"
              placeholder="e.g. 14:00 - 18:00"
              fullWidth
              value={event.time || ''}
              onChange={(e) => onChange('time', e.target.value)}
              helperText="This will be displayed to users (optional)"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Event Banner</Typography>
            <Box
              sx={{
                border: '1px dashed #ccc',
                borderRadius: '4px',
                p: 3,
                mt: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                height: '150px',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: previewImage || event.image ? 'transparent' : 'action.hover'
              }}
              onClick={() => !isLoading && document.getElementById('modal-banner-upload').click()}
            >
              {(previewImage || event.image) ? (
                <img
                  src={previewImage || event.image}
                  alt="Event banner preview"
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <>
                  <UploadIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Drag and drop your image here, or click to select
                  </Typography>
                </>
              )}
              <input
                id="modal-banner-upload"
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </Box>
            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
              Max file size: 5MB (JPEG, PNG)
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isEdit ? 'Update Event' : 'Create Event'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventModal;








































// // components/EventDashboard/EventModal.jsx
// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogActions,
//   Button,
//   CircularProgress,
//   Grid,
//   TextField,
//   Box,
//   Typography,
//   IconButton,
//   FormControl,
//   Select,
//   MenuItem,
//   FormControlLabel,
//   Switch,
//   ToggleButtonGroup,
//   ToggleButton,
//   Card,
//   CardContent,
//   InputAdornment,
//   TextareaAutosize,
//   styled
// } from '@mui/material';
// import {
//   Close as CloseIcon,
//   LocationOn as LocationIcon,
//   Upload as UploadIcon,
//   CalendarMonth as CalendarIcon,
//   AttachMoney as MoneyIcon,
//   ConfirmationNumber as TicketIcon
// } from '@mui/icons-material';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// // Styled components
// const ImageUploadBox = styled(Box)(({ theme }) => ({
//   border: '1px dashed rgba(0, 0, 0, 0.12)',
//   borderRadius: '16px',
//   padding: theme.spacing(5),
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   justifyContent: 'center',
//   cursor: 'pointer',
//   height: '200px',
//   transition: 'all 0.2s ease-in-out',
//   '&:hover': {
//     borderColor: theme.palette.primary.main,
//     backgroundColor: 'rgba(29, 155, 240, 0.04)',
//   },
// }));

// const EventModal = ({ open, onClose, onSave, event, isEdit }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [fieldErrors, setFieldErrors] = useState({
//     title: false,
//     description: false,
//     startDate: false,
//     endDate: false,
//     location: false
//   });
//   const [eventData, setEventData] = useState({
//     title: '',
//     description: '',
//     startDate: null,
//     endDate: null,
//     location: '',
//     ticketType: 'free',
//     price: 0,
//     time: '',
//     banner: null,
//     isAllDay: false,
//     isRecurring: false,
//     recurrencePattern: 'weekly',
//     venueName: '',
//     city: '',
//     postalCode: '',
//     isOnline: false,
//     onlineLink: '',
//     specialInstructions: ''
//   });

//   // Initialize form data when modal opens or event prop changes
//   useEffect(() => {
//     if (open) {
//       setError(null);
//       if (event) {
//         setEventData({
//           ...eventData,
//           ...event,
//           startDate: event.startDate ? new Date(event.startDate) : null,
//           endDate: event.endDate ? new Date(event.endDate) : null,
//           ticketType: event.price > 0 ? 'paid' : 'free'
//         });
//         if (event.image) {
//           setPreviewImage(event.image);
//         }
//       }
//     }
//   }, [open, event]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Validate file type
//     if (!file.type.startsWith('image/')) {
//       setError('Please upload an image file');
//       return;
//     }

//     // Validate file size (5MB max)
//     if (file.size > 5 * 1024 * 1024) {
//       setError('File size must be less than 5MB');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPreviewImage(reader.result);
//     };
//     reader.readAsDataURL(file);
    
//     setEventData(prev => ({
//       ...prev,
//       banner: file
//     }));
//     setError(null);
//   };

//   const validateFields = () => {
//     const errors = {
//       title: !eventData.title,
//       description: !eventData.description,
//       startDate: !eventData.startDate,
//       endDate: !eventData.endDate,
//       location: !eventData.location
//     };

//     setFieldErrors(errors);
//     return Object.values(errors).some(error => error);
//   };

//   const validateDates = () => {
//     if (!eventData.startDate || !eventData.endDate) return false;

//     const start = new Date(eventData.startDate);
//     const end = new Date(eventData.endDate);

//     if (start >= end) {
//       setError('End date must be after start date');
//       return false;
//     }
//     return true;
//   };

//   const handleChange = (field, value) => {
//     setEventData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleTicketTypeChange = (e, newValue) => {
//     if (newValue !== null) {
//       setEventData(prev => ({
//         ...prev,
//         ticketType: newValue,
//         price: newValue === 'free' ? 0 : prev.price
//       }));
//     }
//   };

//   const handleSave = async () => {
//     setError(null);

//     // Validate required fields
//     if (validateFields()) {
//       setError('Please fill all required fields');
//       return;
//     }

//     // Validate date logic
//     if (!validateDates()) {
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Prepare the data to send
//       const dataToSave = {
//         title: eventData.title,
//         description: eventData.description,
//         startDate: eventData.startDate,
//         endDate: eventData.endDate,
//         location: eventData.location,
//         price: eventData.ticketType === 'free' ? 0 : Number(eventData.price),
//         time: eventData.time,
//         isAllDay: eventData.isAllDay,
//         isRecurring: eventData.isRecurring,
//         recurrencePattern: eventData.recurrencePattern,
//         venueName: eventData.venueName,
//         city: eventData.city,
//         postalCode: eventData.postalCode,
//         isOnline: eventData.isOnline,
//         onlineLink: eventData.onlineLink,
//         specialInstructions: eventData.specialInstructions,
//         banner: eventData.banner,
//         ...(eventData.image && { image: eventData.image })
//       };

//       await onSave(dataToSave);
//       onClose();
//     } catch (err) {
//       console.error('Save error:', err);
//       setError(err.response?.data?.message || err.message || 'Failed to save event');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         p={2}
//         borderBottom="1px solid rgba(0, 0, 0, 0.12)"
//       >
//         <Typography variant="h6" fontWeight="bold">
//           {isEdit ? 'Edit Event' : 'Create New Event'}
//         </Typography>
//         <IconButton onClick={onClose} disabled={isLoading}>
//           <CloseIcon />
//         </IconButton>
//       </Box>

//       <DialogContent dividers>
//         {error && (
//           <Box mb={2}>
//             <Typography color="error">{error}</Typography>
//           </Box>
//         )}

//         <Grid container spacing={3}>
//           <Grid item xs={12}>
//             <TextField
//               label="Event Title *"
//               placeholder="Enter event title"
//               fullWidth
//               value={eventData.title || ''}
//               onChange={(e) => handleChange('title', e.target.value)}
//               error={fieldErrors.title}
//               helperText={fieldErrors.title ? 'This field is required' : ''}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Event Description *"
//               placeholder="Describe your event"
//               fullWidth
//               multiline
//               rows={4}
//               value={eventData.description || ''}
//               onChange={(e) => handleChange('description', e.target.value)}
//               error={fieldErrors.description}
//               helperText={fieldErrors.description ? 'This field is required' : ''}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DateTimePicker
//                 label="Start Date & Time *"
//                 value={eventData.startDate || null}
//                 onChange={(value) => handleChange('startDate', value)}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     fullWidth
//                     error={fieldErrors.startDate}
//                     helperText={fieldErrors.startDate ? 'This field is required' : ''}
//                   />
//                 )}
//               />
//             </LocalizationProvider>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DateTimePicker
//                 label="End Date & Time *"
//                 value={eventData.endDate || null}
//                 onChange={(value) => handleChange('endDate', value)}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     fullWidth
//                     error={fieldErrors.endDate}
//                     helperText={fieldErrors.endDate ? 'This field is required' : ''}
//                     minDateTime={eventData.startDate || null}
//                   />
//                 )}
//               />
//             </LocalizationProvider>
//           </Grid>
//           <Grid item xs={12}>
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={eventData.isAllDay || false}
//                   onChange={(e) => handleChange('isAllDay', e.target.checked)}
//                   color="primary"
//                 />
//               }
//               label="All-day event"
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={eventData.isRecurring || false}
//                   onChange={(e) => handleChange('isRecurring', e.target.checked)}
//                   color="primary"
//                 />
//               }
//               label="Recurring event"
//             />
//           </Grid>
//           {eventData.isRecurring && (
//             <Grid item xs={12}>
//               <FormControl fullWidth>
//                 <Select
//                   value={eventData.recurrencePattern || 'weekly'}
//                   onChange={(e) => handleChange('recurrencePattern', e.target.value)}
//                 >
//                   <MenuItem value="daily">Daily</MenuItem>
//                   <MenuItem value="weekly">Weekly</MenuItem>
//                   <MenuItem value="monthly">Monthly</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//           )}
//           <Grid item xs={12}>
//             <TextField
//               label="Venue Location *"
//               placeholder="Enter venue address"
//               fullWidth
//               value={eventData.location || ''}
//               onChange={(e) => handleChange('location', e.target.value)}
//               error={fieldErrors.location}
//               helperText={fieldErrors.location ? 'This field is required' : ''}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton>
//                       <LocationIcon />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <Typography variant="subtitle1" gutterBottom>
//               Ticket Type
//             </Typography>
//             <ToggleButtonGroup
//               value={eventData.ticketType}
//               exclusive
//               onChange={handleTicketTypeChange}
//               fullWidth
//             >
//               <ToggleButton value="free">
//                 <Box display="flex" flexDirection="column" alignItems="center">
//                   <TicketIcon />
//                   <Typography>Free</Typography>
//                 </Box>
//               </ToggleButton>
//               <ToggleButton value="paid">
//                 <Box display="flex" flexDirection="column" alignItems="center">
//                   <MoneyIcon />
//                   <Typography>Paid</Typography>
//                 </Box>
//               </ToggleButton>
//             </ToggleButtonGroup>
//           </Grid>
//           {eventData.ticketType === 'paid' && (
//             <Grid item xs={12}>
//               <TextField
//                 label="Price"
//                 type="number"
//                 placeholder="0.00"
//                 fullWidth
//                 value={eventData.price || ''}
//                 onChange={(e) => handleChange('price', e.target.value)}
//                 InputProps={{
//                   startAdornment: <InputAdornment position="start">$</InputAdornment>,
//                   inputProps: { min: 0, step: 0.01 }
//                 }}
//               />
//             </Grid>
//           )}
//           <Grid item xs={12}>
//             <TextField
//               label="Time Display"
//               placeholder="e.g. 14:00 - 18:00"
//               fullWidth
//               value={eventData.time || ''}
//               onChange={(e) => handleChange('time', e.target.value)}
//               helperText="This will be displayed to users (optional)"
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <Typography variant="subtitle1">Event Banner</Typography>
//             <ImageUploadBox
//               onClick={() => !isLoading && document.getElementById('modal-banner-upload').click()}
//             >
//               {(previewImage || eventData.image) ? (
//                 <img
//                   src={previewImage || eventData.image}
//                   alt="Event banner preview"
//                   style={{
//                     width: '100%',
//                     height: '100%',
//                     objectFit: 'cover',
//                     borderRadius: '12px'
//                   }}
//                 />
//               ) : (
//                 <>
//                   <UploadIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
//                   <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
//                     Drag and drop your image here, or click to select
//                   </Typography>
//                   <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
//                     Max file size: 5MB (JPEG, PNG)
//                   </Typography>
//                 </>
//               )}
//               <input
//                 id="modal-banner-upload"
//                 type="file"
//                 accept="image/*"
//                 hidden
//                 onChange={handleFileChange}
//                 disabled={isLoading}
//               />
//             </ImageUploadBox>
//           </Grid>
//         </Grid>
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={onClose} disabled={isLoading}>
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleSave}
//           disabled={isLoading}
//           startIcon={isLoading ? <CircularProgress size={20} /> : null}
//         >
//           {isLoading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Event' : 'Create Event')}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EventModal;