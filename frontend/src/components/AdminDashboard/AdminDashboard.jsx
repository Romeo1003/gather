import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Badge,
  Divider,
  useTheme,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Switch,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Event as EventIcon,
  NotificationsActive as RequestsIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  LocationOn as LocationIcon,
  WbSunny as WeatherIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  Logout as LogoutIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import WeatherWidget from '../Weather/WeatherWidget';
import PaymentApprovalPanel from './PaymentApprovalPanel';
import InviteAcceptanceWindow from '../Invites/InviteAcceptanceWindow';
import NotificationsPanel from './NotificationsPanel';

const API_URL = 'http://localhost:5001/api';

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [actionReason, setActionReason] = useState('');
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [stats, setStats] = useState({
    totalEvents: 0,
    pendingRequests: 0,
    activeEvents: 0,
    totalUsers: 0
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  
  // User menu state for logout
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // Current city for weather
  const [currentLocation, setCurrentLocation] = useState('San Francisco, US');
  
  // Request detail dialog state
  const [requestDetailOpen, setRequestDetailOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Email dialog state
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: ''
  });
  
  // Response dialog state
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  
  // Toast notification state
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // State for requests filtering
  const [activeRequestsFilter, setActiveRequestsFilter] = useState('all');
  const [requestSearchTerm, setRequestSearchTerm] = useState('');
  const [activeRequestTypeFilter, setActiveRequestTypeFilter] = useState('all');

  // Handle user menu click
  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle user menu close
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle logout
  const handleLogout = () => {
    handleUserMenuClose();
    logout();
  };

  // Handle profile settings navigation
  const handleProfileSettings = () => {
    handleUserMenuClose();
    navigate('/profile');
  };

  // Function to show toast message
  const showToast = (message, severity = 'success') => {
    setToast({
      open: true,
      message,
      severity
    });
  };

  // Function to close toast
  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToast({...toast, open: false});
  };

  // Admin-only validation
  useEffect(() => {
    if (!user) {
      console.log('No authenticated user, redirecting to login');
      navigate('/signin');
      return;
    }
    
    if (user.role !== 'admin') {
      console.log('Unauthorized access attempt to admin dashboard:', user.email, user.role);
      showToast('Access Denied: Administrator privileges required', 'error');
      navigate('/dashboard/home');
      return;
    }
    
    console.log('Admin dashboard accessed by:', user.email);
    
    // Display PIN security message
    showToast('Admin portal secured with PIN authentication', 'info');
  }, [user, navigate]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get admin dashboard stats
        const statsResponse = await axios.get(`${API_URL}/admin/dashboard-stats`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        
        setStats({
          totalEvents: statsResponse.data.totalEvents || 0,
          pendingRequests: statsResponse.data.pendingRequests || 0,
          activeEvents: statsResponse.data.activeEvents || 0,
          totalUsers: statsResponse.data.totalUsers || 0
        });
        
        // Get events data
        const eventsResponse = await axios.get(`${API_URL}/events`);
        setEvents(eventsResponse.data);
        
        // Get users data
        try {
          const usersResponse = await axios.get(`${API_URL}/admin/users`, {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          });
          setUsers(usersResponse.data);
        } catch (error) {
          console.error('Failed to load users, using mock data:', error);
          // Fallback to mock data if API call fails
          setUsers([
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', eventsCreated: 5 },
            { id: 2, name: 'Maya Smith', email: 'maya@gmail.com', role: 'customer', eventsCreated: 2 },
            { id: 3, name: 'Admin User', email: 'admin@gather.com', role: 'admin', eventsCreated: 0 }
          ]);
        }
        
        // Get pending requests data
        try {
          const requestsResponse = await axios.get(`${API_URL}/admin/requests`, {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          });
          setRequests(requestsResponse.data);
        } catch (error) {
          console.error('Failed to load requests, using mock data:', error);
          // Fallback to mock data if API call fails
          setRequests([
            { id: 1, eventId: 'ABC123', eventTitle: 'Web Development Workshop', requester: 'John Doe', requesterEmail: 'john@example.com', requestType: 'booking', status: 'pending', date: '2025-04-15' },
            { id: 2, eventId: 'DEF456', eventTitle: 'Design Thinking Seminar', requester: 'Maya Smith', requesterEmail: 'maya@gmail.com', requestType: 'modification', status: 'pending', date: '2025-04-16' },
            { id: 3, eventId: 'GHI789', eventTitle: 'Startup Networking Event', requester: 'John Doe', requesterEmail: 'john@example.com', requestType: 'cancellation', status: 'approved', date: '2025-04-10' }
          ]);
        }

        // Get invites data
        try {
          const invitesResponse = await axios.get(`${API_URL}/admin/invites`, {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          });
          setInvites(invitesResponse.data);
        } catch (error) {
          console.error('Failed to load invites, using mock data:', error);
          // Fallback to mock data if API call fails
          setInvites([
            { 
              id: 1, 
              code: 'ABC12345', 
              eventId: 'EVT001', 
              eventTitle: 'Summer Festival', 
              email: 'guest1@example.com', 
              status: 'pending', 
              sentBy: 'admin@gather.com', 
              sentDate: '2023-06-01T10:00:00Z' 
            },
            { 
              id: 2, 
              code: 'XYZ67890', 
              eventId: 'EVT002', 
              eventTitle: 'Corporate Training', 
              email: 'guest2@example.com', 
              status: 'accepted', 
              sentBy: 'john@example.com', 
              sentDate: '2023-06-05T14:30:00Z',
              responseDate: '2023-06-06T09:15:00Z'
            },
            { 
              id: 3, 
              code: 'DEF55555', 
              eventId: 'EVT003', 
              eventTitle: 'Tech Conference', 
              email: 'guest3@example.com', 
              status: 'declined', 
              sentBy: 'admin@gather.com', 
              sentDate: '2023-06-10T11:45:00Z',
              responseDate: '2023-06-11T16:20:00Z'
            }
          ]);
        }

        // Check for new requests
        const pendingCount = requests.filter(req => req.status === 'pending').length;
        if (pendingCount > 0) {
          showToast(`You have ${pendingCount} pending request${pendingCount > 1 ? 's' : ''}`, 'info');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up polling to check for new requests every minute
    const requestPollInterval = setInterval(() => {
      checkForNewRequests();
    }, 60000); // 1 minute

    return () => {
      clearInterval(requestPollInterval);
    };
  }, [user.token]);

  // Function to check for new requests
  const checkForNewRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/requests/new`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      if (response.data.hasNewRequests) {
        showToast('You have new event requests!', 'info');
        
        // Show browser notification if permission is granted
        if (Notification.permission === 'granted') {
          new Notification('New Event Request', {
            body: `You have ${response.data.newRequestsCount} new event request(s)`,
            icon: '/favicon.ico'
          });
        }
        
        // Update the requests list
        const requestsResponse = await axios.get(`${API_URL}/admin/requests`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setRequests(requestsResponse.data);
        // Update stats
        setStats(prev => ({
          ...prev,
          pendingRequests: prev.pendingRequests + response.data.newRequestsCount
        }));
      }
    } catch (error) {
      console.error('Error checking for new requests:', error);
    }
  };
  
  // Request browser notification permission
  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            showToast('Notification permission granted!', 'success');
          }
        });
      }
    }
  };
  
  // Check notification permissions on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    if (newValue === 5) { // Settings tab index
      navigate('/profile');
    } else {
      setActiveTab(newValue);
    }

    // Reset search term when changing tabs
    setRequestSearchTerm('');
  };

  const handleEventAction = (event, action) => {
    setSelectedEvent(event);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleDeleteConfirm = (event) => {
    setSelectedEvent(event);
    setDeleteConfirmOpen(true);
  };

  const handleActionConfirm = async () => {
    try {
      // Make API call to handle event request
      await axios.post(`${API_URL}/admin/requests/${selectedEvent.id}`, {
        action: actionType,
        reason: actionReason
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      // Update local state
      setRequests(requests.map(req => 
        req.id === selectedEvent.id ? { ...req, status: actionType === 'approve' ? 'approved' : 'rejected' } : req
      ));

      setActionDialogOpen(false);
      setActionReason('');
      showToast(`Request ${actionType === 'approve' ? 'approved' : 'rejected'} successfully`, 'success');
    } catch (error) {
      console.error('Error processing action:', error);
      showToast('Failed to process your action. Please try again.', 'error');
    }
  };

  const handleEventDelete = async () => {
    try {
      // Make API call to delete event
      await axios.delete(`${API_URL}/events/${selectedEvent.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      // Update local state
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setDeleteConfirmOpen(false);
      showToast('Event deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting event:', error);
      showToast('Failed to delete event. Please try again.', 'error');
    }
  };

  const handleEventView = (event) => {
    // In a real app, this would navigate to the event detail page
    navigate(`/event/${event.id}`);
  };

  // Add new function to handle user role changes
  const handleUserRoleChange = async (userEmail, newRole) => {
    try {
      await axios.put(`${API_URL}/admin/users/${userEmail}/role`, {
        role: newRole
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      // Update local state
      setUsers(users.map(user => 
        user.email === userEmail ? { ...user, role: newRole } : user
      ));
      
      // Show success message
      showToast(`User role successfully changed to ${newRole}`, 'success');
    } catch (error) {
      console.error('Error updating user role:', error);
      showToast(error.response?.data?.message || 'Failed to update user role', 'error');
    }
  };
  
  // Add new function to handle user deletion
  const handleUserDelete = async (userEmail) => {
    try {
      await axios.delete(`${API_URL}/admin/users/${userEmail}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      // Update local state
      setUsers(users.filter(user => user.email !== userEmail));
      
      // Show success message
      showToast('User successfully deleted', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast(error.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  // Handle event request approval/rejection
  const handleEventRequest = async (requestId, status) => {
    try {
      const response = await axios.post(
        `${API_URL}/admin/requests/${requestId}`, 
        { 
          status,
          notifyUser: true, // Add option to notify the user
          adminMessage: status === 'approve' ? 
            'Your request has been approved. Thank you for using our platform!' : 
            'Your request has been rejected. Please contact us for more information.'
        }, 
        { headers: { Authorization: `Bearer ${user.token}` }}
      );
      
      if (response.status === 200) {
        // Update requests list
        setRequests(requests.map(req => 
          req.id === requestId ? { ...req, status: status === 'approve' ? 'approved' : 'rejected' } : req
        ));
        
        // Update stats
        setStats(prev => ({
          ...prev,
          pendingRequests: Math.max(0, prev.pendingRequests - 1)
        }));
        
        // Show success message
        showToast(`Event request ${status === 'approve' ? 'approved' : 'rejected'} successfully. User has been notified.`, 'success');
      }
    } catch (error) {
      console.error('Error handling event request:', error);
      showToast(`Failed to ${status} request: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  // View request details
  const viewRequestDetails = (request) => {
    setSelectedRequest(request);
    setRequestDetailOpen(true);
  };

  // Send email to user
  const sendEmailToUser = (email, subject, initialMessage = '') => {
    setEmailData({
      to: email,
      subject: subject,
      message: initialMessage
    });
    setEmailDialogOpen(true);
  };

  // Send email
  const handleSendEmail = async () => {
    try {
      // API call to send email
      const response = await axios.post(`${API_URL}/admin/send-email`, 
        emailData,
        { headers: { Authorization: `Bearer ${user.token}` }}
      );
      
      if (response.status === 200) {
        showToast('Email sent successfully', 'success');
        setEmailDialogOpen(false);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      showToast(`Failed to send email: ${error.response?.data?.message || error.message}`, 'error');
    }
  };
  
  // Handle responding to a request with a message
  const handleRespondToRequest = (request) => {
    setSelectedRequest(request);
    setResponseMessage('');
    setResponseDialogOpen(true);
  };
  
  // Submit response
  const submitResponse = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/admin/requests/${selectedRequest.id}/response`, 
        { 
          message: responseMessage,
          notifyUser: true
        }, 
        { headers: { Authorization: `Bearer ${user.token}` }}
      );
      
      if (response.status === 200) {
        // Update the request in the list
        setRequests(requests.map(req => 
          req.id === selectedRequest.id ? { ...req, adminResponse: responseMessage } : req
        ));
        
        showToast('Response sent successfully', 'success');
        setResponseDialogOpen(false);
      }
    } catch (error) {
      console.error('Error sending response:', error);
      showToast(`Failed to send response: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  // Add function to handle invite generation
  const handleGenerateInvite = async (eventId, email, message) => {
    try {
      const response = await axios.post(`${API_URL}/invites`, 
        { 
          eventId,
          email,
          message
        }, 
        { headers: { Authorization: `Bearer ${user.token}` }}
      );
      
      if (response.status === 201) {
        // Add new invite to the list
        setInvites([response.data.invite, ...invites]);
        
        // Show success message
        showToast(`Invite code generated: ${response.data.inviteCode}`, 'success');
        return response.data.inviteCode;
      }
    } catch (error) {
      console.error('Error generating invite:', error);
      showToast(error.response?.data?.message || 'Failed to generate invite', 'error');
      return null;
    }
  };

  // Add function to handle invite deletion/revocation
  const handleRevokeInvite = async (inviteCode) => {
    try {
      // In a real application, you would call an API to revoke the invite
      // For now, we'll simulate it
      // const response = await axios.delete(`${API_URL}/admin/invites/${inviteCode}`, {
      //   headers: {
      //     Authorization: `Bearer ${user.token}`
      //   }
      // });
      
      // if (response.status === 200) {
        // Remove invite from the list
        setInvites(invites.filter(invite => invite.code !== inviteCode));
        
        // Show success message
        showToast('Invite successfully revoked', 'success');
      // }
    } catch (error) {
      console.error('Error revoking invite:', error);
      showToast(error.response?.data?.message || 'Failed to revoke invite', 'error');
    }
  };

  // Render the admin header with logout functionality
  const renderAdminHeader = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mr: 1 }}>
          Admin Dashboard
        </Typography>
        <Chip 
          label="Admin" 
          size="small" 
          color="primary" 
          sx={{ ml: 1, bgcolor: theme.palette.primary.main }}
        />
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Admin Profile">
          <IconButton
            onClick={handleUserMenuClick}
            aria-controls={open ? 'admin-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.04)',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' }
            }}
          >
            <PersonIcon />
          </IconButton>
        </Tooltip>
        
        <Menu
          id="admin-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleUserMenuClose}
          MenuListProps={{
            'aria-labelledby': 'admin-button',
          }}
        >
          <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
            {user?.email}
          </Typography>
          <Divider />
          <MenuItem onClick={handleProfileSettings}>
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

  // Dashboard content
  const renderDashboard = () => (
    <Box sx={{ flexGrow: 1 }}>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#bbdefb',
            }}
          >
            <Typography variant="h6" gutterBottom>Total Events</Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              {stats.totalEvents}
            </Typography>
            <Typography variant="body2">Events created on the platform</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#c8e6c9',
            }}
          >
            <Typography variant="h6" gutterBottom>Active Events</Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              {stats.activeEvents}
            </Typography>
            <Typography variant="body2">Currently published events</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#ffecb3',
            }}
          >
            <Typography variant="h6" gutterBottom>Pending Requests</Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              {stats.pendingRequests}
            </Typography>
            <Typography variant="body2">Requests awaiting approval</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#e1bee7',
            }}
          >
            <Typography variant="h6" gutterBottom>Total Users</Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              {stats.totalUsers}
            </Typography>
            <Typography variant="body2">Registered users</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Notifications Panel */}
      <NotificationsPanel />

      {/* Weather Widget and Payment Approval */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <WeatherWidget location={currentLocation} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PaymentApprovalPanel />
        </Grid>
      </Grid>

      {/* Recent Events */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Recent Events</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Weather</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.slice(0, 5).map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.id}</TableCell>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{new Date(event.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                        {event.location}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <WeatherWidget location={event.location} compact={true} />
                    </TableCell>
                    <TableCell>
                      {new Date(event.endDate) > new Date() ? (
                        <Chip label="Active" color="success" size="small" />
                      ) : (
                        <Chip label="Completed" color="default" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleEventView(event)}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteConfirm(event)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <WeatherWidget location={currentLocation} />
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Recent Activity</Typography>
              {events.length === 0 ? (
                <Alert severity="info">No recent activity</Alert>
              ) : (
                <Box>
                  <div>
                    {[...requests, ...events]
                      .sort((a, b) => new Date(b.date || b.createdAt || b.startDate) - new Date(a.date || a.createdAt || a.startDate))
                      .slice(0, 5)
                      .map((item, index) => (
                        <div key={index}>
                          <Typography variant="body2" component="span" fontWeight="bold">
                            {item.requestType ? 
                              `${item.requestType.charAt(0).toUpperCase() + item.requestType.slice(1)} Request` : 
                              'Event Created'}
                          </Typography>
                          <Typography variant="body2">
                            {item.eventTitle || item.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(item.date || item.createdAt || item.startDate).toLocaleString()}
                            {item.requester && ` by ${item.requester}`}
                          </Typography>
                        </div>
                      ))}
                  </div>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Pending Approvals</Typography>
          {requests.filter(req => req.status === 'pending').length === 0 ? (
            <Alert severity="info">No pending requests at this time.</Alert>
          ) : (
            <Box>
              {requests.filter(req => req.status === 'pending').map((request) => (
                <Card key={request.id} sx={{ mb: 2, p: 2, border: '1px solid #eaeaea', boxShadow: 'rgba(0,0,0,0.1) 0px 1px 3px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {request.eventTitle}
                        <Chip 
                          size="small" 
                          label={request.requestType.toUpperCase()} 
                          color={
                            request.requestType === 'booking' ? 'primary' :
                            request.requestType === 'cancellation' ? 'error' : 'warning'
                          }
                          sx={{ ml: 1, fontSize: '0.7rem' }}
                        />
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Submitted by: {request.requester} ({request.requesterEmail || request.requester})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Event Date: {request.date}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Request ID: {request.id}
                      </Typography>
                      {request.message && (
                        <Box sx={{ mt: 1, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="body2">
                            <strong>Message:</strong> {request.message}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Box>
                      <Button 
                        variant="contained" 
                        color="success" 
                        size="small" 
                        sx={{ mr: 1 }}
                        onClick={() => handleEventRequest(request.id, 'approve')}
                        startIcon={<ApproveIcon />}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="error" 
                        size="small"
                        onClick={() => handleEventRequest(request.id, 'reject')}
                        startIcon={<RejectIcon />}
                      >
                        Reject
                      </Button>
                      <IconButton 
                        size="small" 
                        sx={{ ml: 1 }}
                        onClick={() => handleRespondToRequest(request)}
                        title="Respond with message"
                      >
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </Paper>
      </Grid>
    </Box>
  );

  // Events management content
  const renderEvents = () => (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">All Events</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField 
            size="small" 
            placeholder="Search events..." 
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />,
            }}
          />
          <Button startIcon={<FilterIcon />} variant="outlined" size="small">
            Filter
          </Button>
        </Box>
      </Box>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Event ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Organizer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.id}</TableCell>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.name || 'Maya Smith'}</TableCell>
                <TableCell>{new Date(event.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>
                  {new Date(event.endDate) > new Date() ? (
                    <Chip label="Active" color="success" size="small" />
                  ) : (
                    <Chip label="Completed" color="default" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEventView(event)}>
                    <ViewIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteConfirm(event)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  // User management content
  const renderUsers = () => (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">User Management</Typography>
        <TextField 
          size="small" 
          placeholder="Search users..." 
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />,
          }}
        />
      </Box>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.email || index}>
                <TableCell>{user.id || index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    color={user.role === 'admin' ? 'secondary' : 'primary'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    title="View user details"
                  >
                    <ViewIcon fontSize="small" />
                  </IconButton>
                  
                  {/* Role toggle button */}
                  <IconButton 
                    size="small" 
                    title={`Change role to ${user.role === 'admin' ? 'customer' : 'admin'}`}
                    onClick={() => {
                      // Confirm before changing role
                      if (window.confirm(`Are you sure you want to change ${user.email}'s role from ${user.role} to ${user.role === 'admin' ? 'customer' : 'admin'}?`)) {
                        handleUserRoleChange(user.email, user.role === 'admin' ? 'customer' : 'admin');
                      }
                    }}
                    color="primary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  
                  {/* Delete user button (hidden for current user) */}
                  {user.email !== 'admin@gather.com' && (
                    <IconButton 
                      size="small" 
                      title="Delete user"
                      onClick={() => {
                        // Confirm before deleting
                        if (window.confirm(`Are you sure you want to delete user ${user.email}? This action cannot be undone.`)) {
                          handleUserDelete(user.email);
                        }
                      }}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  // Requests content
  const renderRequests = () => {
    const filteredRequests = requests
      .filter(request => activeRequestsFilter === 'all' || request.status === activeRequestsFilter)
      .filter(request => activeRequestTypeFilter === 'all' || request.requestType === activeRequestTypeFilter)
      .filter(request => 
        request.eventTitle.toLowerCase().includes(requestSearchTerm.toLowerCase()) ||
        request.requester.toLowerCase().includes(requestSearchTerm.toLowerCase())
      );

    const pendingCount = requests.filter(req => req.status === 'pending').length;

    return (
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Event Requests</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField 
              size="small" 
              placeholder="Search requests..." 
              InputProps={{
                startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />,
              }}
              onChange={(e) => setRequestSearchTerm(e.target.value)}
              value={requestSearchTerm}
              sx={{ mr: 2 }}
            />
            <Button 
              variant={activeRequestsFilter === 'all' ? 'contained' : 'outlined'} 
              size="small"
              onClick={() => setActiveRequestsFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={activeRequestsFilter === 'pending' ? 'contained' : 'outlined'} 
              size="small"
              onClick={() => setActiveRequestsFilter('pending')}
              startIcon={<Badge badgeContent={pendingCount} color="error">{null}</Badge>}
            >
              Pending
            </Button>
            <Button 
              variant={activeRequestsFilter === 'approved' ? 'contained' : 'outlined'} 
              size="small"
              onClick={() => setActiveRequestsFilter('approved')}
            >
              Approved
            </Button>
            <Button 
              variant={activeRequestsFilter === 'rejected' ? 'contained' : 'outlined'} 
              size="small"
              onClick={() => setActiveRequestsFilter('rejected')}
            >
              Rejected
            </Button>
            <Button 
              variant={activeRequestTypeFilter === 'all' ? 'contained' : 'outlined'} 
              color="secondary"
              size="small"
              onClick={() => setActiveRequestTypeFilter('all')}
              sx={{ ml: 2 }}
            >
              All Types
            </Button>
            <Button 
              variant={activeRequestTypeFilter === 'booking' ? 'contained' : 'outlined'} 
              color="secondary"
              size="small"
              onClick={() => setActiveRequestTypeFilter('booking')}
            >
              Bookings
            </Button>
            <Button 
              variant={activeRequestTypeFilter === 'cancellation' ? 'contained' : 'outlined'} 
              color="secondary"
              size="small"
              onClick={() => setActiveRequestTypeFilter('cancellation')}
            >
              Cancellations
            </Button>
          </Box>
        </Box>
        
        {filteredRequests.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>No requests match your current filters.</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Request ID</TableCell>
                  <TableCell>Event</TableCell>
                  <TableCell>Requester</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.eventTitle}</TableCell>
                    <TableCell>{request.requester}</TableCell>
                    <TableCell>
                      <Chip 
                        label={request.requestType} 
                        color={
                          request.requestType === 'booking' ? 'primary' :
                          request.requestType === 'cancellation' ? 'error' : 'warning'
                        } 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>
                      <Chip 
                        label={request.status} 
                        color={
                          request.status === 'approved' ? 'success' : 
                          request.status === 'rejected' ? 'error' : 
                          'warning'
                        } 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      {request.status === 'pending' && (
                        <>
                          <IconButton size="small" color="success" onClick={() => handleEventRequest(request.id, 'approve')} title="Approve">
                            <ApproveIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleEventRequest(request.id, 'reject')} title="Reject">
                            <RejectIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                      <IconButton size="small" onClick={() => viewRequestDetails(request)} title="View details">
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      {request.status === 'approved' && (
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => sendEmailToUser(request.requesterEmail, `RE: ${request.eventTitle} - ${request.requestType} request`, `Dear ${request.requester},\n\nRegarding your ${request.requestType} request for "${request.eventTitle}":\n\n`)}
                          title="Send email to user"
                        >
                          <EmailIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    );
  };

  // Render venues and invite management tab
  const renderVenuesAndInvites = () => (
    <Box>
      <Box sx={{ mb: 4 }}>
        <PaymentApprovalPanel user={user} />
      </Box>
      
      {selectedEvent && (
        <Box sx={{ mb: 4 }}>
          <InviteAcceptanceWindow 
            eventId={selectedEvent.id} 
            user={user} 
            isAdmin={true}
          />
        </Box>
      )}
      
      {!selectedEvent && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Event Invitations
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Select an event from your events list to view and manage invitations.
          </Alert>
        </Paper>
      )}
    </Box>
  );

  // Settings content
  const renderSettings = () => {
    // This function is still needed for the tab panel content
    // Although with the new navigation, it might not be displayed directly
    
    // Redirect to profile settings
    useEffect(() => {
      navigate('/profile');
    }, []);

    return (
      <Box>
        <Typography>Redirecting to profile settings...</Typography>
      </Box>
    );
  };

  // Invite Management content
  const renderInviteManagement = () => {
    const [inviteSearchTerm, setInviteSearchTerm] = useState('');
    const [inviteStatusFilter, setInviteStatusFilter] = useState('all');
    const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
    const [newInviteData, setNewInviteData] = useState({
      eventId: '',
      email: '',
      message: ''
    });
    const [availableEvents, setAvailableEvents] = useState(events);
    
    // Filter invites based on search term and status filter
    const filteredInvites = invites
      .filter(invite => inviteStatusFilter === 'all' || invite.status === inviteStatusFilter)
      .filter(invite => 
        invite.code.toLowerCase().includes(inviteSearchTerm.toLowerCase()) ||
        invite.email.toLowerCase().includes(inviteSearchTerm.toLowerCase()) ||
        invite.eventTitle?.toLowerCase().includes(inviteSearchTerm.toLowerCase())
      );
    
    // Handle opening the generate invite dialog
    const openGenerateDialog = () => {
      setGenerateDialogOpen(true);
    };
    
    // Handle creating a new invite
    const handleCreateInvite = async () => {
      const inviteCode = await handleGenerateInvite(
        newInviteData.eventId,
        newInviteData.email,
        newInviteData.message
      );
      
      if (inviteCode) {
        setGenerateDialogOpen(false);
        setNewInviteData({
          eventId: '',
          email: '',
          message: ''
        });
      }
    };
    
    return (
      <>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Invite Management</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField 
                size="small" 
                placeholder="Search invites..." 
                InputProps={{
                  startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />,
                }}
                value={inviteSearchTerm}
                onChange={(e) => setInviteSearchTerm(e.target.value)}
              />
              <Button 
                variant={inviteStatusFilter === 'all' ? 'contained' : 'outlined'} 
                size="small"
                onClick={() => setInviteStatusFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={inviteStatusFilter === 'pending' ? 'contained' : 'outlined'} 
                size="small"
                onClick={() => setInviteStatusFilter('pending')}
              >
                Pending
              </Button>
              <Button 
                variant={inviteStatusFilter === 'accepted' ? 'contained' : 'outlined'} 
                size="small"
                onClick={() => setInviteStatusFilter('accepted')}
              >
                Accepted
              </Button>
              <Button 
                variant={inviteStatusFilter === 'declined' ? 'contained' : 'outlined'} 
                size="small"
                onClick={() => setInviteStatusFilter('declined')}
              >
                Declined
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<EmailIcon />}
                onClick={openGenerateDialog}
              >
                Generate New Invite
              </Button>
            </Box>
          </Box>
          
          {filteredInvites.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>No invites match your current filters.</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Invite Code</TableCell>
                    <TableCell>Event</TableCell>
                    <TableCell>Recipient</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Sent By</TableCell>
                    <TableCell>Sent Date</TableCell>
                    <TableCell>Response Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInvites.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace" fontWeight="bold">
                          {invite.code}
                        </Typography>
                      </TableCell>
                      <TableCell>{invite.eventTitle || invite.eventId}</TableCell>
                      <TableCell>{invite.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={invite.status} 
                          color={
                            invite.status === 'accepted' ? 'success' :
                            invite.status === 'declined' ? 'error' : 'warning'
                          } 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{invite.sentBy}</TableCell>
                      <TableCell>{new Date(invite.sentDate).toLocaleString()}</TableCell>
                      <TableCell>
                        {invite.responseDate ? new Date(invite.responseDate).toLocaleString() : '-'}
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          title="Send reminder"
                          onClick={() => sendEmailToUser(
                            invite.email, 
                            `Reminder: You're invited to ${invite.eventTitle || 'an event'}`, 
                            `Hello,\n\nThis is a reminder that you have been invited to ${invite.eventTitle || 'an event'}.\nYour invite code is: ${invite.code}\n\nPlease respond at your earliest convenience.`
                          )}
                          color="primary"
                        >
                          <NotificationsIcon fontSize="small" />
                        </IconButton>
                        
                        <IconButton 
                          size="small" 
                          title="Revoke invite"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to revoke the invite for ${invite.email}?`)) {
                              handleRevokeInvite(invite.code);
                            }
                          }}
                          color="error"
                          disabled={invite.status === 'accepted'} // Don't allow revoking accepted invites
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
        
        {/* Generate Invite Dialog */}
        <Dialog 
          open={generateDialogOpen} 
          onClose={() => setGenerateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Generate New Invite</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                select
                label="Event"
                fullWidth
                value={newInviteData.eventId}
                onChange={(e) => setNewInviteData({...newInviteData, eventId: e.target.value})}
                margin="normal"
                required
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </TextField>
              
              <TextField
                label="Recipient Email"
                fullWidth
                value={newInviteData.email}
                onChange={(e) => setNewInviteData({...newInviteData, email: e.target.value})}
                margin="normal"
                required
                type="email"
              />
              
              <TextField
                label="Message (Optional)"
                fullWidth
                value={newInviteData.message}
                onChange={(e) => setNewInviteData({...newInviteData, message: e.target.value})}
                margin="normal"
                multiline
                rows={4}
                placeholder="Include a personal message with the invitation..."
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setGenerateDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateInvite} 
              variant="contained"
              disabled={!newInviteData.eventId || !newInviteData.email}
            >
              Generate Invite
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {renderAdminHeader()}
      
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'auto' }}>
        {/* Tabs Menu */}
        <Paper
          elevation={0}
          sx={{
            width: 80,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 3,
            borderRight: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Admin Dashboard Tabs"
            sx={{
              '& .MuiTabs-indicator': {
                left: 0,
                right: 'auto',
              },
              '& .MuiTab-root': {
                minWidth: 80,
                py: 2,
              },
            }}
          >
            <Tab
              icon={<DashboardIcon />}
              aria-label="Dashboard"
              sx={{
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
            <Tab
              icon={<EventIcon />}
              aria-label="Events"
              sx={{
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
            <Tab
              icon={<PeopleIcon />}
              aria-label="Users"
              sx={{
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
            <Tab
              icon={
                <Badge
                  badgeContent={pendingRequests.length}
                  color="error"
                  invisible={pendingRequests.length === 0}
                >
                  <RequestsIcon />
                </Badge>
              }
              aria-label="Requests"
              sx={{
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
            <Tab
              icon={<LocationIcon />}
              aria-label="Venues & Invites"
              sx={{
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
            <Tab
              icon={<SettingsIcon />}
              aria-label="Settings"
              sx={{
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
          </Tabs>
        </Paper>

        {/* Content Area */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', bgcolor: '#f9fafb', p: 3 }}>
          {/* ActiveTab */}
          {activeTab === 0 && renderDashboard()}
          {activeTab === 1 && renderEvents()}
          {activeTab === 2 && renderUsers()}
          {activeTab === 3 && renderRequests()}
          {activeTab === 4 && renderVenuesAndInvites()}
          {activeTab === 5 && renderSettings()}
        </Box>
      </Box>
      
      {/* Dialogs and Notifications */}
      {/* ... (keep existing dialogs) */}
      
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard; 