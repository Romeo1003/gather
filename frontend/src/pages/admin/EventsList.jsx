import React, { useState, useEffect, useCallback } from 'react';
import {
	Box,
	Typography,
	Button,
	TextField,
	InputAdornment,
	IconButton,
	CircularProgress,
	Snackbar,
	Alert,
	Tooltip,
	CssBaseline,
	Pagination,
} from '@mui/material';
import {
	Search as SearchIcon,
	Add as AddIcon,
	Refresh as RefreshIcon,
} from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';
import Sidebar from './Sidebar';
import AdminHeader from './Header';
import { deleteEvent } from '../../services/eventService';

// Import the new components we'll create
import EventsTable from '../../components/admin/EventsTable';
import EventsGrid from '../../components/admin/EventsGrid';
import ViewEventDialog from '../../components/admin/dialogs/ViewEventDialog';
import EditEventDialog from '../../components/admin/dialogs/EditEventDialog';
import AddEventDialog from '../../components/admin/dialogs/AddEventDialog';
import DeleteConfirmDialog from '../../components/admin/dialogs/DeleteConfirmDialog';

const EventList = () => {
	// State for events data and UI
	const [events, setEvents] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [refreshing, setRefreshing] = useState(false);
	const [view, setView] = useState('grid'); // 'grid' or 'table'
	const [page, setPage] = useState(1);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const eventsPerPage = 6;

	// Modal states
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [eventToDelete, setEventToDelete] = useState(null);
	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [currentEvent, setCurrentEvent] = useState({
		title: '',
		description: '',
		startDate: '',
		endDate: '',
		time: '',
		location: '',
		price: 0,
		image: null
	});

	// Snackbar state
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'success'
	});

	// Fetch events from API
	const fetchEvents = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem('token');
			const response = await axios.get('http://localhost:3000/api/events', {
				headers: { Authorization: `Bearer ${token}` }
			});

			// Handle different response formats
			let eventsData = [];
			if (Array.isArray(response.data)) {
				eventsData = response.data;
			} else if (response.data?.events && Array.isArray(response.data.events)) {
				eventsData = response.data.events;
			} else if (response.data?.data && Array.isArray(response.data.data)) {
				eventsData = response.data.data;
			}

			setEvents(eventsData);
			setFilteredEvents(eventsData);
			setError(null);
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to fetch events');
			setSnackbar({
				open: true,
				message: err.response?.data?.message || 'Failed to fetch events',
				severity: 'error'
			});
			setEvents([]);
			setFilteredEvents([]);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchEvents();
	}, []);

	// Handle refresh
	const handleRefresh = () => {
		setRefreshing(true);
		fetchEvents();
	};

	// Filter events based on search term
	useEffect(() => {
		const filtered = events.filter(event => {
			const term = searchTerm.toLowerCase();
			return (
				event.title.toLowerCase().includes(term) ||
				event.description.toLowerCase().includes(term) ||
				event.location.toLowerCase().includes(term)
			);
		});
		setFilteredEvents(filtered);
		setPage(1);
	}, [searchTerm, events]);

	// Delete event handlers
	const handleDeleteClick = (event) => {
		setEventToDelete(event);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		try {
			const result = await deleteEvent(eventToDelete.id);

			// Optimistic UI update
			setEvents(prev => prev.filter(event => event.id !== eventToDelete.id));
			setFilteredEvents(prev => prev.filter(event => event.id !== eventToDelete.id));

			setSnackbar({
				open: true,
				message: result.message || 'Event deleted successfully',
				severity: 'success'
			});
		} catch (err) {
			setSnackbar({
				open: true,
				message: err.message || 'Failed to delete event',
				severity: 'error'
			});
			// Refresh the list to ensure consistency
			fetchEvents();
		} finally {
			setDeleteDialogOpen(false);
			setEventToDelete(null);
		}
	};

	// View event handler
	const handleViewClick = (event) => {
		setSelectedEvent(event);
		setViewDialogOpen(true);
	};

	// Edit event handlers
	const handleEditClick = (event) => {
		setCurrentEvent({
			...event,
			startDate: dayjs(event.startDate).format('YYYY-MM-DD'),
			endDate: dayjs(event.endDate).format('YYYY-MM-DD')
		});
		setEditDialogOpen(true);
	};

	const handleEditSave = async (updatedEvent, selectedFile) => {
		try {
			const token = localStorage.getItem('token');
			const formData = new FormData();

			// Append all event data to formData
			Object.keys(updatedEvent).forEach(key => {
				if (key !== 'image') {
					formData.append(key, updatedEvent[key]);
				}
			});

			if (selectedFile) {
				formData.append('banner', selectedFile);
			}

			await axios.put(
				`http://localhost:3000/api/events/${updatedEvent.id}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'multipart/form-data'
					}
				}
			);

			await fetchEvents();
			setSnackbar({
				open: true,
				message: 'Event updated successfully',
				severity: 'success'
			});
			setEditDialogOpen(false);
		} catch (err) {
			setSnackbar({
				open: true,
				message: err.response?.data?.message || 'Failed to update event',
				severity: 'error'
			});
		}
	};

	// Add event handlers
	const handleAddClick = () => {
		setCurrentEvent({
			title: '',
			description: '',
			startDate: '',
			endDate: '',
			time: '',
			location: '',
			price: 0,
			image: null
		});
		setAddDialogOpen(true);
	};

	const handleAddSave = async (newEvent, selectedFile) => {
		try {
			const token = localStorage.getItem('token');
			const formData = new FormData();

			// Append all event data to formData
			Object.keys(newEvent).forEach(key => {
				if (key !== 'image') {
					formData.append(key, newEvent[key]);
				}
			});

			if (selectedFile) {
				formData.append('banner', selectedFile);
			}

			await axios.post(
				'http://localhost:3000/api/events',
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'multipart/form-data'
					}
				}
			);

			await fetchEvents();
			setSnackbar({
				open: true,
				message: 'Event created successfully',
				severity: 'success'
			});
			setAddDialogOpen(false);
		} catch (err) {
			setSnackbar({
				open: true,
				message: err.response?.data?.message || 'Failed to create event',
				severity: 'error'
			});
		}
	};

	const handleSnackbarClose = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	const handlePageChange = (event, value) => {
		setPage(value);
	};

	// Pagination logic
	const count = Math.ceil(filteredEvents.length / eventsPerPage);
	const paginatedEvents = filteredEvents.slice(
		(page - 1) * eventsPerPage,
		page * eventsPerPage
	);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw", overflow: "hidden" }}>
			<AdminHeader toggleSidebar={toggleSidebar} />
			<Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
				<Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
				<Box sx={{ p: 3, flexGrow: 1, overflow: "auto" }}>
					<CssBaseline />
					<Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
						Event Management
					</Typography>

					{/* Action Bar */}
					<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
						<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
							<TextField
								variant="outlined"
								size="small"
								placeholder="Search events..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon />
										</InputAdornment>
									),
								}}
								sx={{ minWidth: 250 }}
							/>
							<Tooltip title="Refresh data">
								<IconButton onClick={handleRefresh} disabled={refreshing}>
									<RefreshIcon />
								</IconButton>
							</Tooltip>
							<Button
								variant="outlined"
								onClick={() => setView(view === 'grid' ? 'table' : 'grid')}
							>
								{view === 'grid' ? 'Table View' : 'Grid View'}
							</Button>
						</Box>
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={handleAddClick}
						>
							Add New Event
						</Button>
					</Box>

					{/* Loading State */}
					{loading ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
							<CircularProgress size={60} />
						</Box>
					) : error ? (
						<Alert severity="error" sx={{ mb: 3 }}>
							{error}
						</Alert>
					) : view === 'grid' ? (
						<>
							{/* Grid View */}
							<EventsGrid 
								events={paginatedEvents} 
								onViewClick={handleViewClick} 
								onEditClick={handleEditClick} 
								onDeleteClick={handleDeleteClick} 
							/>
							{count > 1 && (
								<Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
									<Pagination
										count={count}
										page={page}
										onChange={handlePageChange}
										color="primary"
									/>
								</Box>
							)}
						</>
					) : (
						/* Table View */
						<EventsTable 
							events={filteredEvents} 
							onViewClick={handleViewClick} 
							onEditClick={handleEditClick} 
							onDeleteClick={handleDeleteClick} 
						/>
					)}

					{/* Dialogs */}
					<ViewEventDialog 
						open={viewDialogOpen}
						event={selectedEvent}
						onClose={() => setViewDialogOpen(false)}
					/>

					<EditEventDialog 
						open={editDialogOpen}
						event={currentEvent}
						onClose={() => setEditDialogOpen(false)}
						onSave={handleEditSave}
					/>

					<AddEventDialog 
						open={addDialogOpen}
						onClose={() => setAddDialogOpen(false)}
						onSave={handleAddSave}
					/>

					<DeleteConfirmDialog 
						open={deleteDialogOpen}
						event={eventToDelete}
						onClose={() => setDeleteDialogOpen(false)}
						onConfirm={handleDeleteConfirm}
					/>

					{/* Snackbar for notifications */}
					<Snackbar
						open={snackbar.open}
						autoHideDuration={6000}
						onClose={handleSnackbarClose}
						anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
					>
						<Alert
							onClose={handleSnackbarClose}
							severity={snackbar.severity}
							sx={{ width: '100%' }}
						>
							{snackbar.message}
						</Alert>
					</Snackbar>
				</Box>
			</Box>
		</Box>
	);
};

export default EventList;