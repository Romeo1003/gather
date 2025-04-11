// components/EventDashboard/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import {
  ListAlt as ListAltIcon,
  Add as AddIcon,
  ConfirmationNumber as TicketIcon,
} from "@mui/icons-material";

const SidebarItem = ({
  icon,
  text,
  to,
  sidebarOpen,
  selected = false
}) => {
  return (
    <ListItem
      component={Link}
      to={to}
      button
      selected={selected}
      sx={{
        borderRadius: "12px",
        my: 0.5,
        px: 2,
        minHeight: 52,
        transition: "all 0.3s ease",
        backgroundColor: selected ? "rgba(33, 150, 243, 0.08)" : "transparent",
        "&:hover": {
          backgroundColor: selected
            ? "rgba(33, 150, 243, 0.12)"
            : "rgba(0, 0, 0, 0.04)",
          transform: "translateX(4px)",
        },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 40,
          color: selected ? "primary.main" : "text.secondary",
          transition: "color 0.3s ease",
        }}
      >
        {icon}
      </ListItemIcon>
      {sidebarOpen && (
        <ListItemText
          primary={
            <Typography
              variant="body1"
              sx={{
                fontWeight: selected ? 600 : 400,
                color: selected ? "primary.main" : "text.primary",
                transition: "all 0.3s ease",
                opacity: sidebarOpen ? 1 : 0,
              }}
            >
              {text}
            </Typography>
          }
          sx={{
            ml: 2,
            opacity: sidebarOpen ? 1 : 0,
            transition: "opacity 0.3s ease, margin 0.3s ease",
          }}
        />
      )}
      {selected && sidebarOpen && (
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 4,
            backgroundColor: "primary.main",
            transition: "all 0.3s ease",
          }}
        />
      )}
    </ListItem>
  );
};

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const sidebarWidth = 260;
  const collapsedWidth = 72;

  return (
    <Box
      component="nav"
      sx={{
        width: sidebarOpen ? sidebarWidth : collapsedWidth,
        flexShrink: 0,
        backgroundColor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        overflow: sidebarOpen ? "auto" : "visible",
        boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
        transition: "width 0.3s ease-in-out, box-shadow 0.3s ease",
        zIndex: 1200,
        height: "100vh",
        position: "sticky",
        top: 0,
        paddingTop: 2,
        paddingBottom: 2,
      }}
    >
      <List
        component="nav"
        aria-label="main navigation"
        sx={{
          py: 0,
          px: 1,
          width: "100%",
        }}
      >
        <SidebarItem
          icon={<ListAltIcon />}
          text="Event List & Details"
          to="/dashboard/home"
          sidebarOpen={sidebarOpen}
          selected={location.pathname === "/dashboard/home"}
        />
        <SidebarItem
          icon={<AddIcon />}
          text="Create Event"
          to="/dashboard/create-event"
          sidebarOpen={sidebarOpen}
          selected={location.pathname === "/dashboard/create-event"}
        />
        <SidebarItem
          icon={<TicketIcon />}
          text="Bookings & Tickets"
          to="/dashboard/bookings"
          sidebarOpen={sidebarOpen}
          selected={location.pathname === "/dashboard/bookings"}
        />
      </List>
    </Box>
  );
};

export default Sidebar;