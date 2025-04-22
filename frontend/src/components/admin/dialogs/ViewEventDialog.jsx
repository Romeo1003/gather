import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Grid,
  Typography,
  Box,
  Chip,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AttachMoney as PriceIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';

const ViewEventDialog = ({ open, event, onClose, onEdit }) => {
  if (!event) return null;

  const formatDate = (date) => {
    return dayjs(date).format('MMM D, YYYY');
  };

  const getStatusColor = (startDate, endDate) => {
    const now = dayjs();
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (now.isBefore(start)) return 'primary';
    if (now.isAfter(start) && now.isBefore(end)) return 'success';
    return 'default';
  };

  const getStatusText = (startDate, endDate) => {
    const now = dayjs();
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (now.isBefore(start)) return 'Upcoming';
    if (now.isAfter(start) && now.isBefore(end)) return 'Ongoing';
    return 'Past';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 3
      }}>
        <Typography variant="h6" fontWeight={600}>Event Details</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {event.image && (
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={event.image}
                alt={event.title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
            </Grid>
          )}
          <Grid item xs={12} md={event.image ? 6 : 12}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {event.title}
              </Typography>
              <Chip
                label={getStatusText(event.startDate, event.endDate)}
                color={getStatusColor(event.startDate, event.endDate)}
                size="small"
                sx={{ borderRadius: 1, mb: 2 }}
              />
              <Typography variant="body1" sx={{ mb: 2 }}>
                {event.description}
              </Typography>
            </Box>

            <List disablePadding>
              <ListItem disablePadding sx={{ mb: 2 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <CalendarIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Date & Time"
                  secondary={`${formatDate(event.startDate)} - ${formatDate(event.endDate)}${event.time ? ` at ${event.time}` : ''}`}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>

              <ListItem disablePadding sx={{ mb: 2 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <LocationIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Location"
                  secondary={event.location}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <PriceIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Price"
                  secondary={event.price > 0 ? `$${event.price.toFixed(2)}` : 'Free'}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        {event.registrations && event.registrations.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Registrations ({event.registrations.length})
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <List disablePadding>
                {event.registrations.slice(0, 5).map((registration, index) => (
                  <ListItem
                    key={index}
                    disablePadding
                    sx={{
                      mb: index < Math.min(event.registrations.length, 5) - 1 ? 2 : 0,
                      pb: index < Math.min(event.registrations.length, 5) - 1 ? 2 : 0,
                      borderBottom: index < Math.min(event.registrations.length, 5) - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={registration.name || 'Attendee'}
                      secondary={registration.email || 'No email provided'}
                    />
                  </ListItem>
                ))}
              </List>
              {event.registrations.length > 5 && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button size="small">
                    View all {event.registrations.length} registrations
                  </Button>
                </Box>
              )}
            </Paper>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 1, textTransform: 'none' }}
        >
          Close
        </Button>
        {onEdit && (
          <Button
            onClick={() => {
              onClose();
              onEdit(event);
            }}
            variant="contained"
            startIcon={<EditIcon />}
            sx={{ borderRadius: 1, textTransform: 'none' }}
          >
            Edit Event
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ViewEventDialog;