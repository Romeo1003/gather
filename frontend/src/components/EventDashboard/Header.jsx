// components/EventDashboard/Header.jsx
import { Link } from "react-router-dom";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import {
	CalendarMonth as CalendarIcon,
	Person as PersonIcon,
	ChevronLeft as ChevronLeftIcon,
	Menu as MenuIcon,
} from "@mui/icons-material";

const Header = ({ sidebarOpen, toggleSidebar }) => {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				px: 2.5,
				py: 1.5,
				borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
				bgcolor: "#fff",
				boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
				zIndex: 1100,
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<IconButton
					onClick={toggleSidebar}
					sx={{ mr: 2 }}
					aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
				>
					{sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
				</IconButton>
				<Typography variant="h5" component="h1" fontWeight="bold">
					Event Management
				</Typography>
			</Box>
			<Box sx={{ display: "flex", gap: 1.5 }}>
				<Tooltip title="Calendar">
					<IconButton
						sx={{
							bgcolor: "#f4f9ff",
							"&:hover": { bgcolor: "#e6f2ff" },
						}}
					>
						<CalendarIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title="Profile">
					<Link to="/profile">
						<IconButton
							sx={{
								bgcolor: "#f4f9ff",
								"&:hover": { bgcolor: "#e6f2ff" },
							}}
						>
							<PersonIcon />
						</IconButton>
					</Link>
				</Tooltip>
			</Box>
		</Box>
	);
};

export default Header;