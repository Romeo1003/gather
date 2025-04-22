import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Paper,
  Tabs,
  Tab,
  Divider,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon
} from '@mui/icons-material';
import EventsTable from './EventsTable';
import EventsGrid from './EventsGrid';
import AddEventDialog from './dialogs/AddEventDialog';
import EditEventDialog from './dialogs/EditEventDialog';
import ViewEventDialog from './dialogs/ViewEventDialog';
import DeleteConfirmDialog from './dialogs/DeleteConfirmDialog';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../../services/eventService';

const EventsManagement = () => {
  // State for events and UI
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState(0); // 0 for grid, 1 for table
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for dialogs
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch events on component mount
  // Add authentication check
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to access this page');
      return;
    }
    
    loadEvents();
  }, []);

  // Filter events when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEvents(events);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = events.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  // Load events from API
  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
      setFilteredEvents(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle view mode change
  const handleViewModeChange = (event, newValue) => {
    setViewMode(newValue);
  };

  // Dialog handlers
  // Improve loading state handling for CRUD operations
  const handleAddEvent = async (newEvent, imageFile) => {
    setLoading(true); // Show loading state
    try {
      const createdEvent = await createEvent(newEvent, imageFile);
      setEvents(prev => [...prev, createdEvent]);
      setAddDialogOpen(false);
      showSnackbar('Event created successfully!', 'success');
    } catch (err) {
      console.error('Failed to create event:', err);
      showSnackbar('Failed to create event. Please try again.', 'error');
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const handleEditEvent = async (updatedEvent, imageFile) => {
    try {
      const result = await updateEvent(updatedEvent.id, updatedEvent, imageFile);
      setEvents(prev => prev.map(event => 
        event.id === result.id ? result : event
      ));
      setEditDialogOpen(false);
      showSnackbar('Event updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update event:', err);
      showSnackbar('Failed to update event. Please try again.', 'error');
    }
  };

  // Implement optimistic updates for better UX
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    // Optimistically remove from UI
    const eventId = selectedEvent.id;
    const previousEvents = [...events];
    setEvents(prev => prev.filter(event => event.id !== eventId));
    setDeleteDialogOpen(false);
    
    try {
      await deleteEvent(eventId);
      showSnackbar('Event deleted successfully!', 'success');
    } catch (err) {
      // Restore previous state on error
      setEvents(previousEvents);
      console.error('Failed to delete event:', err);
      showSnackbar('Failed to delete event. Please try again.', 'error');
    }
  };

  // Open dialogs
  const openAddDialog = () => {
    setAddDialogOpen(true);
  };

  const openViewDialog = (event) => {
    setSelectedEvent(event);
    setViewDialogOpen(true);
  };

  const openEditDialog = (event) => {
    setSelectedEvent(event);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (event) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  // Close dialogs
  const closeAddDialog = () => {
    setAddDialogOpen(false);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedEvent(null);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedEvent(null);
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Events Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddDialog}
          sx={{ borderRadius: 1 }}
        >
          Add Event
        </Button>
      </Box>

      {/* Search and View Toggle */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search events by title, description or location"
              value={searchQuery}
              onChange={handleSearchChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Tabs
              value={viewMode}
              onChange={handleViewModeChange}
              aria-label="view mode"
              sx={{ minHeight: 'auto' }}
            >
              <Tab 
                icon={<GridViewIcon />} 
                label="Grid" 
                iconPosition="start"
                sx={{ minHeight: 'auto', py: 1 }}
              />
              <Tab 
                icon={<ListViewIcon />} 
                label="Table" 
                iconPosition="start"
                sx={{ minHeight: 'auto', py: 1 }}
              />
            </Tabs>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Events Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* View Mode Content */}
          {viewMode === 0 ? (
            <EventsGrid
              events={filteredEvents}
              onViewClick={openViewDialog}
              onEditClick={openEditDialog}
              onDeleteClick={openDeleteDialog}
            />
          ) : (
            <EventsTable
              events={filteredEvents}
              onViewClick={openViewDialog}
              onEditClick={openEditDialog}
              onDeleteClick={openDeleteDialog}
            />
          )}

          {/* Empty State */}
          {events.length === 0 && !loading && !error && (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="h6" gutterBottom>
                No events found
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Get started by adding your first event
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openAddDialog}
                sx={{ mt: 2 }}
              >
                Add Event
              </Button>
            </Box>
          )}
        </>
      )}

      {/* Dialogs */}
      <AddEventDialog
        open={addDialogOpen}
        onClose={closeAddDialog}
        onSave={handleAddEvent}
      />

      <EditEventDialog
        open={editDialogOpen}
        event={selectedEvent}
        onClose={closeEditDialog}
        onSave={handleEditEvent}
      />

      <ViewEventDialog
        open={viewDialogOpen}
        event={selectedEvent}
        onClose={closeViewDialog}
        onEdit={openEditDialog}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        event={selectedEvent}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteEvent}
      />

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EventsManagement;