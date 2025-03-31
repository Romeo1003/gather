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
import { Link } from "react-router-dom";

const UpcomingEvents = ({ cardStyle, events }) => {
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
				<Button
					variant="contained"
					color="primary"
					startIcon={<AddIcon />}
					sx={{
						borderRadius: 28,
						px: 3,
						py: 0.75,
						boxShadow: "0 4px 14px rgba(25, 118, 210, 0.3)",
						"&:hover": {
							boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
						},
						width: { xs: "100%", sm: "auto" },
					}}
				>
					<Link
						to="/dashboard/edit-event"
						style={{ color: "white", textDecoration: "none" }}
					>
						Create New Event
					</Link>
				</Button>
			</Box>
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
							}}
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
									justifyContent: "flex-end",
									bgcolor: "rgba(0, 0, 0, 0.01)",
								}}
							>
								<Button
									color="primary"
									size="small"
									startIcon={<EditIcon fontSize="small" />}
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