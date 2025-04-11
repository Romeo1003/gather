import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { 
  Box, 
  Typography, 
  Card, 
  Button, 
  Grid, 
  FormControl, 
  Select, 
  MenuItem,
  Switch,
  Avatar,
  IconButton,
  Container,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Menu as MenuIcon, 
  ChevronLeft as ChevronLeftIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  ListAlt as ListAltIcon,
  Add as AddIcon,
  ConfirmationNumber as TicketIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

const ProfileSettings = () => {
  // Get auth context
  const { user, logout, deleteAccount } = useContext(AuthContext);
  
  // State for sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Profile and Settings States
  const [profileVisibility, setProfileVisibility] = useState('Private');
  const [dataSharing, setDataSharing] = useState('Restrict');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  const [fullName, setFullName] = useState('User Name');
  const [email, setEmail] = useState(user?.email || 'user@example.com');
  const [joinDate, setJoinDate] = useState('January 2024');

  // Delete account dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Snackbar for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Sidebar width calculations
  const sidebarWidth = 240;
  const collapsedWidth = 58;
  const currentSidebarWidth = sidebarOpen ? sidebarWidth : collapsedWidth;

  // Edit Handlers
  const handleEditFullName = () => {
    const newName = prompt('Enter new full name', fullName);
    if (newName) setFullName(newName);
  };

  const handleEditEmail = () => {
    const newEmail = prompt('Enter new email', email);
    if (newEmail) setEmail(newEmail);
  };

  const handleChangePassword = () => {
    // Implement password change logic
    const currentPassword = prompt('Enter current password');
    const newPassword = prompt('Enter new password');
    const confirmPassword = prompt('Confirm new password');

    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      setSnackbar({
        open: true,
        message: 'Password changed successfully',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Password change failed. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
    setConfirmPassword('');
    setPasswordError('');
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteAccount = async () => {
    if (!confirmPassword) {
      setPasswordError('Please enter your password to confirm deletion');
      return;
    }

    try {
      const result = await deleteAccount(confirmPassword);
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Account deleted successfully',
          severity: 'success'
        });
        handleCloseDeleteDialog();
      } else {
        setPasswordError(result.message);
      }
    } catch (error) {
      setPasswordError('An error occurred. Please try again.');
      console.error(error);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      logout();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100vw', 
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      bgcolor: '#f9fafb'
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        px: 2.5,
        py: 1.5,
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        bgcolor: '#fff',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        zIndex: 1100
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Profile Settings
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Tooltip title="Calendar">
            <IconButton sx={{ 
              bgcolor: '#f4f9ff', 
              '&:hover': { bgcolor: '#e6f2ff' }
            }}>
              <CalendarIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Profile">
            <IconButton sx={{ 
              bgcolor: '#f4f9ff', 
              '&:hover': { bgcolor: '#e6f2ff' }
            }}>
              <PersonIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <Box 
          component="nav" 
          sx={{ 
            width: currentSidebarWidth, 
            flexShrink: 0, 
            bgcolor: '#ffffff', 
            borderRight: '1px solid rgba(0, 0, 0, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            overflow: sidebarOpen ? 'auto' : 'visible',
            boxShadow: '4px 0 10px rgba(0, 0, 0, 0.03)',
            transition: 'width 0.25s ease-in-out',
            zIndex: 1000,
            position: 'relative',
            paddingTop: 1,
            paddingBottom: 1
          }}
        >
          <Box sx={{ py: 0.5, px: 0.5 }}>
            <Box 
              sx={{ 
                borderRadius: '8px', 
                mb: 0.5,
                bgcolor: '#f4f9ff',
                '&:hover': { bgcolor: '#e6f2ff' },
                px: 1.5,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <ListAltIcon sx={{ 
                mr: sidebarOpen ? 1 : 0, 
                color: '#1976d2',
                fontSize: '1.2rem'
              }} />
              {sidebarOpen && (
                <Typography color="primary" fontWeight="medium">
                  Profile Overview
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box component="main" sx={{ 
          flexGrow: 1, 
          p: 3, 
          overflow: 'auto',
          transition: 'all 0.25s ease-in-out',
          ml: 0,
        }}>
          <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
            Profile Settings
          </Typography>

          <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" component="h3">
                Personal Information
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Full Name
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body1">
                    {fullName}
                  </Typography>
                  <IconButton size="small" onClick={handleEditFullName} sx={{ ml: 1 }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email Address
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body1">
                    {email}
                  </Typography>
                  <IconButton size="small" onClick={handleEditEmail} sx={{ ml: 1 }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Member Since
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {joinDate}
                </Typography>
              </Grid>
            </Grid>
          </Card>

          <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" component="h3">
                Account Settings
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Profile Visibility
                </Typography>
                <FormControl fullWidth variant="outlined" size="small" sx={{ mt: 1 }}>
                  <Select
                    value={profileVisibility}
                    onChange={(e) => setProfileVisibility(e.target.value)}
                  >
                    <MenuItem value="Public">Public</MenuItem>
                    <MenuItem value="Private">Private</MenuItem>
                    <MenuItem value="Friends">Friends Only</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Data Sharing
                </Typography>
                <FormControl fullWidth variant="outlined" size="small" sx={{ mt: 1 }}>
                  <Select
                    value={dataSharing}
                    onChange={(e) => setDataSharing(e.target.value)}
                  >
                    <MenuItem value="Allow">Allow All</MenuItem>
                    <MenuItem value="Restrict">Restrict</MenuItem>
                    <MenuItem value="Minimal">Minimal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Push Notifications
                  </Typography>
                  <Switch 
                    checked={pushNotifications} 
                    onChange={(e) => setPushNotifications(e.target.checked)} 
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email Updates
                  </Typography>
                  <Switch 
                    checked={emailUpdates} 
                    onChange={(e) => setEmailUpdates(e.target.checked)} 
                  />
                </Box>
              </Grid>
            </Grid>
          </Card>

          <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" component="h3">
                Security
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleChangePassword}
                sx={{ mr: 2 }}
              >
                Change Password
              </Button>
            </Box>
          </Card>

          <Card sx={{ p: 3, borderRadius: 2, bgcolor: '#fff8f8' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" component="h3" color="error.main">
                Danger Zone
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Logout
              </Button>
              
              <Button 
                variant="contained" 
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleOpenDeleteDialog}
              >
                Delete Account
              </Button>
            </Box>
          </Card>
        </Box>
      </Box>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title" color="error">
          Delete Your Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description" sx={{ mb: 3 }}>
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Confirm your password"
            type="password"
            fullWidth
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Delete My Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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

export default ProfileSettings;