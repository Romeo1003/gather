import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const AdminProfile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = () => {
    // Implement profile update logic
    console.log('Profile updated:', profile);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Profile Settings
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} display="flex" justifyContent="center">
            <Avatar
              src={currentUser?.photoURL}
              sx={{ width: 100, height: 100 }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <TextField
              fullWidth
              label="Name"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              value={profile.currentPassword}
              onChange={(e) => setProfile({...profile, currentPassword: e.target.value})}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={profile.newPassword}
              onChange={(e) => setProfile({...profile, newPassword: e.target.value})}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              value={profile.confirmPassword}
              onChange={(e) => setProfile({...profile, confirmPassword: e.target.value})}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSave}>
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminProfile;