import React from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AttachMoney as PriceIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';

const EventsGrid = ({ events, onViewClick, onEditClick, onDeleteClick }) => {
  // Helper functions
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

  const formatDate = (date) => {
    return dayjs(date).format('MMM D, YYYY');
  };

  return (
    <Grid container spacing={3}>
      {events.length > 0 ? (
        events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }
              }}
            >
              {event.image ? (
                <CardMedia
                  component="img"
                  height="160"
                  image={event.image}
                  alt={event.title}
                  sx={{ objectFit: 'cover' }}
                />
              ) : (
                <Box 
                  sx={{ 
                    height: 160, 
                    bgcolor: 'primary.light', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}
                >
                  <Typography variant="h6" color="white">
                    {event.title}
                  </Typography>
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600 }}>
                    {event.title}
                  </Typography>
                  <Chip
                    label={getStatusText(event.startDate, event.endDate)}
                    color={getStatusColor(event.startDate, event.endDate)}
                    size="small"
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 60, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                  {event.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" noWrap>{event.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PriceIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {event.price > 0 ? `$${event.price.toFixed(2)}` : 'Free'}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Tooltip title="View details">
                  <IconButton 
                    size="small" 
                    color="info" 
                    onClick={() => onViewClick(event)}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit event">
                  <IconButton 
                    size="small" 
                    color="primary" 
                    onClick={() => onEditClick(event)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete event">
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => onDeleteClick(event)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              No events found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or create a new event
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default EventsGrid;