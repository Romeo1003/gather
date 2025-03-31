import React, { useState } from 'react';
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
  Divider
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Menu as MenuIcon, 
  ChevronLeft as ChevronLeftIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  ListAlt as ListAltIcon,
  Add as AddIcon,
  ConfirmationNumber as TicketIcon
} from '@mui/icons-material';

const ProfileSettings = () => {
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
  const [email, setEmail] = useState('user@example.com');
  const [joinDate, setJoinDate] = useState('January 2024');

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
      alert('Password changed successfully');
    } else {
      alert('Password change failed. Please try again.');
    }
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmDelete) {
      // Implement account deletion logic
      alert('Account deletion functionality to be implemented');
    }
  };

  const handleLogout = () => {
    // Implement logout logic
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      alert('Logout functionality to be implemented');
    }
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
            {/* <Box 
              sx={{ 
                borderRadius: '8px', 
                mb: 0.5,
                '&:hover': { bgcolor: '#f5f8fa' },
                px: 1.5,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <AddIcon sx={{ 
                mr: sidebarOpen ? 1 : 0, 
                fontSize: '1.2rem'
              }} />
              {sidebarOpen && (
                <Typography>
                  Edit Profile
                </Typography>
              )}
            </Box>
            <Box 
              sx={{ 
                borderRadius: '8px', 
                '&:hover': { bgcolor: '#f5f8fa' },
                px: 1.5,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <TicketIcon sx={{ 
                mr: sidebarOpen ? 1 : 0, 
                fontSize: '1.2rem'
              }} />
              {sidebarOpen && (
                <Typography>
                  Account Settings
                </Typography>
              )}
            </Box> */}
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

          <Card 
            sx={{
              borderRadius: 4,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              p: 3
            }}
          >
            {/* Profile Header */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              mb: 3 
            }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    bgcolor: 'primary.main',
                    fontSize: '2.5rem' 
                  }}
                >
                  {fullName.charAt(0).toUpperCase()}
                </Avatar>
              </Box>
              <Typography variant="h6" fontWeight="bold">{fullName}</Typography>
              <Typography variant="body2" color="text.secondary">
                Member since {joinDate}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Personal Information */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    bgcolor: '#f4f6f8',
                    p: 2,
                    borderRadius: 2
                  }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Full Name</Typography>
                      <Typography variant="body1">{fullName}</Typography>
                    </Box>
                    <IconButton onClick={handleEditFullName}>
                      <EditIcon />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    bgcolor: '#f4f6f8',
                    p: 2,
                    borderRadius: 2
                  }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{email}</Typography>
                    </Box>
                    <IconButton onClick={handleEditEmail}>
                      <EditIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Security Settings */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Security Settings
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                onClick={handleChangePassword}
                sx={{ 
                  borderRadius: 2, 
                  py: 1.5,
                  boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                  }
                }}
              >
                Change Password
              </Button>
            </Box>

            {/* Notification Preferences */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Notification Preferences
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                bgcolor: '#f4f6f8',
                p: 2,
                borderRadius: 2,
                mb: 2
              }}>
                <Box>
                  <Typography variant="body1">Push Notifications</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive notifications about important updates
                  </Typography>
                </Box>
                <Switch 
                  checked={pushNotifications}
                  onChange={() => setPushNotifications(!pushNotifications)}
                />
              </Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                bgcolor: '#f4f6f8',
                p: 2,
                borderRadius: 2
              }}>
                <Box>
                  <Typography variant="body1">Email Updates</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive email notifications about account activity
                  </Typography>
                </Box>
                <Switch 
                  checked={emailUpdates}
                  onChange={() => setEmailUpdates(!emailUpdates)}
                />
              </Box>
            </Box>

            {/* Privacy Settings */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Privacy Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    bgcolor: '#f4f6f8',
                    p: 2,
                    borderRadius: 2
                  }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Profile Visibility</Typography>
                      <FormControl fullWidth variant="standard" sx={{ mt: 1 }}>
                        <Select
                          value={profileVisibility}
                          onChange={(e) => setProfileVisibility(e.target.value)}
                          sx={{ 
                            '&:before': {
                              borderBottom: 'none'
                            },
                            '&:after': {
                              borderBottom: 'none'
                            }
                          }}
                        >
                          <MenuItem value="Public">Public</MenuItem>
                          <MenuItem value="Private">Private</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    bgcolor: '#f4f6f8',
                    p: 2,
                    borderRadius: 2
                  }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Data Sharing</Typography>
                      <FormControl fullWidth variant="standard" sx={{ mt: 1 }}>
                        <Select
                          value={dataSharing}
                          onChange={(e) => setDataSharing(e.target.value)}
                          sx={{ 
                            '&:before': {
                              borderBottom: 'none'
                            },
                            '&:after': {
                              borderBottom: 'none'
                            }
                          }}
                        >
                          <MenuItem value="Allow All">Allow All</MenuItem>
                          <MenuItem value="Restrict">Restrict</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              gap: 2 
            }}>
              <Button 
                variant="contained" 
                color="error"
                fullWidth
                onClick={handleDeleteAccount}
                sx={{ 
                  borderRadius: 2, 
                  py: 1.5,
                  boxShadow: '0 4px 14px rgba(211, 47, 47, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                  }
                }}
              >
                Delete Account
              </Button>
              
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                onClick={handleLogout}
                sx={{ 
                  borderRadius: 2, 
                  py: 1.5,
                  boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                  }
                }}
              >
                
                Logout
              </Button>
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileSettings;