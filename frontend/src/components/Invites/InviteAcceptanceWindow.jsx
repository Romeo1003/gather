import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  CircularProgress, 
  Grid, 
  Table, 
  TableContainer, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Chip, 
  Button, 
  Alert, 
  TextField, 
  InputAdornment, 
  IconButton,
  Card,
  Divider,
  Stack,
  useTheme
} from '@mui/material';
import { 
  Search as SearchIcon, 
  CheckCircle as AcceptedIcon, 
  Cancel as DeclinedIcon, 
  HourglassEmpty as PendingIcon,
  PersonAdd as InviteIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  EventSeat as CapacityIcon
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const InviteAcceptanceWindow = ({ eventId, user, isAdmin = false, isOrganizer = false }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invites, setInvites] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    declined: 0,
    pending: 0,
    paidCount: 0,
    totalRevenue: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [venue, setVenue] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  
  const theme = useTheme();

  // Fetch invites data for the event
  useEffect(() => {
    const fetchInviteData = async () => {
      if (!eventId || !user?.token) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch event invites
        const response = await axios.get(`${API_URL}/invites/event/${eventId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        setInvites(response.data.invites || []);
        setStats(response.data.stats || {
          total: 0,
          accepted: 0,
          declined: 0,
          pending: 0,
          paidCount: 0,
          totalRevenue: 0
        });

        // Fetch event details including venue
        const eventResponse = await axios.get(`${API_URL}/events/${eventId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        setEventDetails(eventResponse.data);
        
        // If event has a venue, fetch venue details
        if (eventResponse.data.venueId) {
          const venueResponse = await axios.get(`${API_URL}/venues/${eventResponse.data.venueId}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          
          setVenue(venueResponse.data);
        }
      } catch (err) {
        console.error("Error fetching invite data:", err);
        setError(err.response?.data?.message || 'Failed to load invite data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInviteData();
  }, [eventId, user?.token]);

  // Filter invites based on search term
  const filteredInvites = invites.filter(invite => 
    invite.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invite.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  // Only admins and organizers can access this component
  if (!isAdmin && !isOrganizer) {
    return (
      <Alert severity="warning">
        You don't have permission to view invitation statistics.
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Invitation Acceptance Dashboard
      </Typography>
      
      {/* Stats Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, bgcolor: theme.palette.primary.light, color: theme.palette.primary.contrastText }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PeopleIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Total Invites</Typography>
            </Box>
            <Typography variant="h4">{stats.total}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, bgcolor: theme.palette.success.light, color: theme.palette.success.contrastText }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AcceptedIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Accepted</Typography>
            </Box>
            <Typography variant="h4">{stats.accepted}</Typography>
            <Typography variant="caption">
              {stats.total > 0 ? `(${Math.round((stats.accepted / stats.total) * 100)}%)` : '(0%)'}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, bgcolor: theme.palette.warning.light, color: theme.palette.warning.contrastText }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PendingIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Pending</Typography>
            </Box>
            <Typography variant="h4">{stats.pending}</Typography>
            <Typography variant="caption">
              {stats.total > 0 ? `(${Math.round((stats.pending / stats.total) * 100)}%)` : '(0%)'}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, bgcolor: theme.palette.grey[200], color: theme.palette.text.primary }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MoneyIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Revenue</Typography>
            </Box>
            <Typography variant="h4">${stats.totalRevenue.toFixed(2)}</Typography>
            <Typography variant="caption">
              {stats.accepted > 0 ? `${stats.paidCount} paid of ${stats.accepted} accepted` : '(0 payments)'}
            </Typography>
          </Card>
        </Grid>
      </Grid>
      
      {/* Venue Capacity */}
      {venue && (
        <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="subtitle1">{venue.name}</Typography>
              <Typography variant="body2" color="text.secondary">{venue.location}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CapacityIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {venue.availableCapacity} available of {venue.capacity}
                </Typography>
              </Box>
              <Box sx={{ width: '100%', mt: 1, height: 8, bgcolor: theme.palette.grey[200], borderRadius: 4 }}>
                <Box 
                  sx={{ 
                    height: '100%', 
                    width: `${Math.min(100, 100 - ((venue.availableCapacity / venue.capacity) * 100))}%`,
                    bgcolor: venue.availableCapacity < venue.capacity * 0.1 ? 'error.main' : 
                             venue.availableCapacity < venue.capacity * 0.3 ? 'warning.main' : 
                             'success.main',
                    borderRadius: 4
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Paper>
      )}
      
      {/* Search and filters */}
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by email or invite code"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />
        <Button 
          variant="contained" 
          startIcon={<InviteIcon />}
          sx={{ ml: 2, whitespace: 'nowrap' }}
        >
          Invite More
        </Button>
      </Box>
      
      {/* Invites Table */}
      {invites.length > 0 ? (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Invite Code</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Sent Date</TableCell>
                <TableCell>Response Date</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>{invite.email}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                      {invite.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {invite.status === 'accepted' && (
                      <Chip 
                        size="small" 
                        color="success" 
                        icon={<AcceptedIcon />} 
                        label="Accepted" 
                      />
                    )}
                    {invite.status === 'declined' && (
                      <Chip 
                        size="small" 
                        color="error" 
                        icon={<DeclinedIcon />} 
                        label="Declined" 
                      />
                    )}
                    {invite.status === 'pending' && (
                      <Chip 
                        size="small" 
                        color="warning" 
                        icon={<PendingIcon />} 
                        label="Pending" 
                      />
                    )}
                  </TableCell>
                  <TableCell>{new Date(invite.sentDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {invite.responseDate ? new Date(invite.responseDate).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    {invite.paid ? (
                      <Chip 
                        size="small" 
                        color={invite.payment?.adminApproved ? "success" : "warning"} 
                        icon={<MoneyIcon />} 
                        label={invite.payment?.adminApproved ? "Approved" : "Awaiting Approval"} 
                      />
                    ) : (
                      invite.status === 'accepted' ? (
                        <Chip 
                          size="small" 
                          color="error" 
                          label="Not Paid" 
                        />
                      ) : '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      variant="outlined"
                      sx={{ mr: 1 }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Alert severity="info">
          No invitations have been sent for this event yet.
        </Alert>
      )}
    </Paper>
  );
};

export default InviteAcceptanceWindow; 