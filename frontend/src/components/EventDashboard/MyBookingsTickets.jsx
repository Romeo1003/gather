import { useEffect, useState } from "react";
import eventService from "../../services/eventService";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import {
	Box,
	Typography,
	Button,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	DialogContentText,
	TextareaAutosize,
	Fab,
	TextField,
	FormControl,
	Select,
	MenuItem,
	InputAdornment,
	IconButton,
} from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import {
	Visibility as VisibilityIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	Add as AddIcon,
} from "@mui/icons-material";
import Header from "./Header";
import Sidebar from "./Sidebar";
import EventModal from "./EventModal";

const MyBookingsTickets = () => {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [status, setStatus] = useState("All Status");
	const [selectedDate, setSelectedDate] = useState("");
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");

	// Modal states
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [editFormData, setEditFormData] = useState({
		title: "",
		description: "",
		date: "",
		time: "",
		location: "",
		price: 0,
	});

	// EventModal states
	const [eventModalOpen, setEventModalOpen] = useState(false);
	const [currentEvent, setCurrentEvent] = useState({
		title: "",
		description: "",
		start_date: null,
		end_date: null,
		time: "",
		location: "",
		price: "",
		banner: null,
		image: null,
	});

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const events = await eventService.getAllEvents();
				setEvents(events);
				setError(null);
			} catch (err) {
				setError("Failed to load events");
				console.error("Error fetching events:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, []);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

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

	const handleEdit = (event) => {
		setSelectedEvent(event);
		setEditFormData({
			title: event.title,
			description: event.description,
			date: event.date,
			time: event.time,
			location: event.location,
			price: event.price || 0,
		});
		setEditModalOpen(true);
	};

	const handleDelete = (event) => {
		setSelectedEvent(event);
		setDeleteModalOpen(true);
	};

	const handleEditSubmit = async () => {
		try {
			const updatedEvent = await eventService.updateEvent(selectedEvent.id, editFormData);
			setEvents(events.map(event =>
				event.id === selectedEvent.id ? updatedEvent : event
			));
			setEditModalOpen(false);
		} catch (error) {
			console.error("Error updating event:", error);
			setError("Failed to update event");
		}
	};

	const handleDeleteConfirm = async () => {
		try {
			await eventService.deleteEvent(selectedEvent.id);
			setEvents(events.filter(event => event.id !== selectedEvent.id));
			setDeleteModalOpen(false);
		} catch (error) {
			console.error("Error deleting event:", error);
			setError("Failed to delete event");
		}
	};

	const handleEditFormChange = (e) => {
		const { name, value } = e.target;
		setEditFormData({
			...editFormData,
			[name]: value,
		});
	};

	const handleEventChange = (field, value) => {
		setCurrentEvent(prev => ({
			...prev,
			[field]: value
		}));
	};

	const handleSaveEvent = async (eventData) => {
		try {
			const newEvent = await eventService.createEvent(eventData);
			setEvents([...events, newEvent]);
			setEventModalOpen(false);
			setCurrentEvent({
				title: "",
				description: "",
				start_date: null,
				end_date: null,
				time: "",
				location: "",
				price: "",
				banner: null,
				image: null,
			});
		} catch (error) {
			console.error("Error creating event:", error);
			setError(error.message || "Failed to create event");
			throw error;
		}
	};

	const filteredEvents = events.filter((event) => {
		const matchesSearch =
			event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			event.description.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesDate = !selectedDate || event.date === selectedDate;

		const matchesStatus =
			status === "All Status" ||
			(status === "Upcoming" && new Date(event.date) > new Date()) ||
			(status === "Past" && new Date(event.date) <= new Date());

		return matchesSearch && matchesStatus && matchesDate;
	});

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
			{/* Header */}
			<Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

			<Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
				{/* Sidebar */}
				<Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

				{/* Main content */}
				<Box
					component="main"
					sx={{
						flexGrow: 1,
						p: 3,
						overflow: "auto",
						transition: "all 0.25s ease-in-out",
					}}
				>
					<Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
						My Bookings & Tickets
					</Typography>

					{/* Search and Filter */}
					<Box
						sx={{
							display: "flex",
							gap: 2,
							mb: 3,
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
									borderRadius: 2,
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
						<FormControl sx={{ minWidth: 150 }}>
							<Select
								value={status}
								onChange={handleStatusChange}
								displayEmpty
								sx={{
									borderRadius: 2,
									height: "100%",
									"& .MuiOutlinedInput-notchedOutline": {
										borderColor: "rgba(0, 0, 0, 0.12)",
									},
								}}
							>
								<MenuItem value="All Status">All Status</MenuItem>
								<MenuItem value="Upcoming">Upcoming</MenuItem>
								<MenuItem value="Past">Past</MenuItem>
								<MenuItem value="Cancelled">Cancelled</MenuItem>
							</Select>
						</FormControl>
						<TextField
							type="date"
							value={selectedDate}
							onChange={handleDateChange}
							sx={{
								width: 160,
								"& .MuiOutlinedInput-root": {
									borderRadius: 2,
								},
							}}
							InputProps={{
								sx: {
									height: "100%",
								},
							}}
						/>
					</Box>

					{loading ? (
						<Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
							<CircularProgress />
						</Box>
					) : error ? (
						<Alert severity="error" sx={{ mb: 3 }}>
							{error}
						</Alert>
					) : filteredEvents.length === 0 ? (
						<Typography variant="body1" sx={{ p: 3 }}>
							No events found matching your criteria
						</Typography>
					) : (
						<TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)' }}>
							<Table sx={{ minWidth: 650 }} aria-label="events table">
								<TableHead>
									<TableRow sx={{ bgcolor: '#f5f5f5' }}>
										<TableCell sx={{ fontWeight: 'bold' }}>Event</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
										<TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Actions</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{filteredEvents.map((event) => (
										<TableRow
											key={event.id}
											sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#f9f9f9' } }}
										>
											<TableCell component="th" scope="row">
												<Typography fontWeight="medium">{event.title}</Typography>
											</TableCell>
											<TableCell>
												<Typography>{event.date}</Typography>
												<Typography color="text.secondary">{event.time}</Typography>
											</TableCell>
											<TableCell>{event.location}</TableCell>
											<TableCell>
												<Chip
													label={
														new Date(event.date) > new Date()
															? "Upcoming"
															: "Past"
													}
													size="small"
													sx={{
														bgcolor:
															new Date(event.date) > new Date()
																? "rgba(46, 125, 50, 0.1)"
																: "rgba(158, 158, 158, 0.1)",
														color:
															new Date(event.date) > new Date()
																? "#2e7d32"
																: "#9e9e9e",
														fontWeight: "medium",
														borderRadius: 8,
														py: 0.5,
													}}
												/>
											</TableCell>
											<TableCell align="right">
												<Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
													<Button
														onClick={() => handleView(event)}
														startIcon={<VisibilityIcon />}
														variant="outlined"
														size="small"
														sx={{
															borderRadius: 8,
															"&:hover": {
																bgcolor: "rgba(25, 118, 210, 0.08)",
															},
														}}
													>
														View
													</Button>
													<Button
														onClick={() => handleEdit(event)}
														startIcon={<EditIcon />}
														variant="outlined"
														size="small"
														color="secondary"
														sx={{
															borderRadius: 8,
															"&:hover": {
																bgcolor: "rgba(156, 39, 176, 0.08)",
															},
														}}
													>
														Edit
													</Button>
													<Button
														onClick={() => handleDelete(event)}
														startIcon={<DeleteIcon />}
														variant="outlined"
														size="small"
														color="error"
														sx={{
															borderRadius: 8,
															"&:hover": {
																bgcolor: "rgba(244, 67, 54, 0.08)",
															},
														}}
													>
														Delete
													</Button>
												</Box>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</Box>
			</Box>

			{/* Floating Add Button */}
			<Fab
				color="primary"
				aria-label="add"
				sx={{
					position: 'fixed',
					bottom: 32,
					right: 32,
				}}
				onClick={() => setEventModalOpen(true)}
			>
				<AddIcon />
			</Fab>

			{/* Event Modal */}
			<EventModal
				open={eventModalOpen}
				onClose={() => setEventModalOpen(false)}
				onSave={handleSaveEvent}
				event={currentEvent}
				onChange={handleEventChange}
				isEdit={false}
			/>

			{/* View Event Modal */}
			<Dialog
				open={viewModalOpen}
				onClose={() => setViewModalOpen(false)}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						Event Details
						<IconButton onClick={() => setViewModalOpen(false)}>
							<CloseIcon />
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent>
					{selectedEvent && (
						<>
							<Typography variant="h5" gutterBottom>
								{selectedEvent.title}
							</Typography>
							<Typography variant="subtitle1" color="text.secondary" gutterBottom>
								{selectedEvent.date} • {selectedEvent.time}
							</Typography>
							<Typography variant="subtitle1" gutterBottom>
								Location: {selectedEvent.location}
							</Typography>
							<Typography variant="subtitle1" gutterBottom>
								Price: ${selectedEvent.price || "Free"}
							</Typography>
							<Typography variant="body1" sx={{ mt: 2 }}>
								{selectedEvent.description}
							</Typography>
							{selectedEvent.image && (
								<Box sx={{ mt: 2 }}>
									<img
										src={selectedEvent.image}
										alt={selectedEvent.title}
										style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
									/>
								</Box>
							)}
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setViewModalOpen(false)}>Close</Button>
				</DialogActions>
			</Dialog>

			{/* Edit Event Modal */}
			<Dialog
				open={editModalOpen}
				onClose={() => setEditModalOpen(false)}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						Edit Event
						<IconButton onClick={() => setEditModalOpen(false)}>
							<CloseIcon />
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent>
					<Box component="form" sx={{ mt: 2 }}>
						<TextField
							margin="normal"
							required
							fullWidth
							label="Event Title"
							name="title"
							value={editFormData.title}
							onChange={handleEditFormChange}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							label="Date"
							type="date"
							name="date"
							InputLabelProps={{ shrink: true }}
							value={editFormData.date}
							onChange={handleEditFormChange}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							label="Time"
							type="time"
							name="time"
							InputLabelProps={{ shrink: true }}
							value={editFormData.time}
							onChange={handleEditFormChange}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							label="Location"
							name="location"
							value={editFormData.location}
							onChange={handleEditFormChange}
						/>
						<TextField
							margin="normal"
							fullWidth
							label="Price"
							type="number"
							name="price"
							value={editFormData.price}
							onChange={handleEditFormChange}
							InputProps={{
								startAdornment: <InputAdornment position="start">$</InputAdornment>,
							}}
						/>
						<TextareaAutosize
							minRows={4}
							style={{
								width: '100%',
								marginTop: '16px',
								padding: '8px',
								border: '1px solid rgba(0, 0, 0, 0.23)',
								borderRadius: '4px',
								fontFamily: 'inherit',
								fontSize: 'inherit'
							}}
							placeholder="Event Description"
							name="description"
							value={editFormData.description}
							onChange={handleEditFormChange}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
					<Button
						onClick={handleEditSubmit}
						variant="contained"
						color="primary"
					>
						Save Changes
					</Button>
				</DialogActions>
			</Dialog>

			{/* Delete Confirmation Modal */}
			<Dialog
				open={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				maxWidth="sm"
			>
				<DialogTitle>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						Confirm Deletion
						<IconButton onClick={() => setDeleteModalOpen(false)}>
							<CloseIcon />
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete the event "{selectedEvent?.title}"? This action cannot be undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
					<Button
						onClick={handleDeleteConfirm}
						variant="contained"
						color="error"
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default MyBookingsTickets;