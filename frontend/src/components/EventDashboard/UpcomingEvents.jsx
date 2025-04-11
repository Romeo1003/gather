// components/EventDashboard/UpcomingEvents.jsx
import {
	Grid,
	Card,
	CardContent,
	Typography,
	Box,
	Button,
	Chip,
	CardMedia,
	CardActions,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const UpcomingEvents = ({ cardStyle, events }) => {
	const navigate = useNavigate();

	const handleEventClick = (eventId) => {
		navigate(`/dashboard/event/${eventId}`);
	};

	return (
		<Box sx={{ mb: 4 }}>
			<Box
				sx={{
					display: "flex",
					flexDirection: { xs: "column", sm: "row" },
					justifyContent: "space-between",
					alignItems: { xs: "flex-start", sm: "center" },
					mb: 2,
					gap: { xs: 1, sm: 0 },
				}}
			>
				<Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: { xs: 1, sm: 0 } }}>
					Upcoming Events
				</Typography>
			</Box>

			{/* Event Cards */}
			<Grid container spacing={2}>
				{events.map((event) => (
					<Grid item xs={12} sm={6} lg={4} key={event.id}>
						<Card
							sx={{
								...cardStyle,
								overflow: "hidden",
								height: "100%",
								display: "flex",
								flexDirection: "column",
								cursor: "pointer",
								'&:hover': {
									boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
									transform: 'translateY(-4px)'
								}
							}}
							onClick={() => handleEventClick(event.id)}
						>
							<CardMedia
								component="img"
								height="160"
								image={event.image}
								alt={event.title}
								sx={{
									transition: "transform 0.5s",
									"&:hover": {
										transform: "scale(1.05)",
									},
									height: { xs: 140, sm: 160, md: 180 },
								}}
							/>
							<CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 2.5 } }}>
								<Typography
									gutterBottom
									variant="h6"
									component="div"
									fontWeight="bold"
									sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
								>
									{event.title}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{
										mb: 0.5,
										fontSize: { xs: '0.875rem', sm: '0.9375rem' }
									}}
								>
									{event.date} • {event.time}
								</Typography>
								<Box sx={{ mt: 1.5 }}>
									<Chip
										label={`${event.registered} Registered`}
										size="small"
										sx={{
											bgcolor: "rgba(46, 125, 50, 0.1)",
											color: "#2e7d32",
											fontWeight: "medium",
											borderRadius: 8,
											py: 0.5,
											fontSize: { xs: '0.75rem', sm: '0.8125rem' },
										}}
									/>
								</Box>
							</CardContent>
							<Box
								sx={{
									p: { xs: 1, sm: 1.5 },
									borderTop: "1px solid rgba(0, 0, 0, 0.05)",
									display: "flex",
									justifyContent: "space-between",
									bgcolor: "rgba(0, 0, 0, 0.01)",
								}}
							>
								<Button
									color="primary"
									size="small"
									onClick={(e) => {
										e.stopPropagation(); // Prevent card click
										navigate(`/dashboard/event/${event.id}`);
									}}
									sx={{
										fontWeight: "medium",
										borderRadius: 8,
										"&:hover": {
											bgcolor: "rgba(25, 118, 210, 0.08)",
										},
										fontSize: { xs: '0.8125rem', sm: '0.875rem' },
									}}
								>
									View Details
								</Button>
								<Button
									color="primary"
									size="small"
									startIcon={<EditIcon fontSize="small" />}
									onClick={(e) => {
										e.stopPropagation(); // Prevent card click
										navigate(`/dashboard/edit-event/${event.id}`);
									}}
									sx={{
										fontWeight: "medium",
										borderRadius: 8,
										"&:hover": {
											bgcolor: "rgba(25, 118, 210, 0.08)",
										},
										fontSize: { xs: '0.8125rem', sm: '0.875rem' },
									}}
								>
									Edit
								</Button>
							</Box>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default UpcomingEvents;