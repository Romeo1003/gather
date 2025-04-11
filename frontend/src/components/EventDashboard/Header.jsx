// components/EventDashboard/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, Tooltip, Menu, MenuItem } from "@mui/material";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import {
	CalendarMonth as CalendarIcon,
	Person as PersonIcon,
	ChevronLeft as ChevronLeftIcon,
	Menu as MenuIcon,
	Logout as LogoutIcon,
	Settings as SettingsIcon
} from "@mui/icons-material";

const Header = ({ sidebarOpen, toggleSidebar }) => {
	const { logout } = useContext(AuthContext);
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		handleClose();
		logout();
	};

	const handleProfileClick = () => {
		handleClose();
		navigate("/profile");
	};

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
				<Tooltip title="Account">
					<IconButton
						aria-controls={open ? "account-menu" : undefined}
						aria-haspopup="true"
						aria-expanded={open ? "true" : undefined}
						onClick={handleMenuClick}
						sx={{
							bgcolor: "#f4f9ff",
							"&:hover": { bgcolor: "#e6f2ff" },
						}}
					>
						<PersonIcon />
					</IconButton>
				</Tooltip>
				<Menu
					id="account-menu"
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					MenuListProps={{
						'aria-labelledby': 'account-button',
					}}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
				>
					<MenuItem onClick={handleProfileClick}>
						<SettingsIcon fontSize="small" sx={{ mr: 1 }} />
						Profile Settings
					</MenuItem>
					<MenuItem onClick={handleLogout}>
						<LogoutIcon fontSize="small" sx={{ mr: 1 }} />
						Logout
					</MenuItem>
				</Menu>
			</Box>
		</Box>
	);
};

export default Header;