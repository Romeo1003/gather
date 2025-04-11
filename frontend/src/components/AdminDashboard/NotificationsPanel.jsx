import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Badge, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Divider, 
  CircularProgress,
  Tooltip,
  Button
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const NotificationsPanel = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [expanded, setExpanded] = useState(false);
  
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/admin/notifications', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user && user.token) {
      fetchNotifications();
      
      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user]);
  
  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/admin/notifications/${id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event_creation':
        return <EventIcon color="primary" />;
      case 'user_registration':
        return <PersonIcon style={{ color: '#4caf50' }} />;
      case 'payment':
        return <PaymentIcon style={{ color: '#ff9800' }} />;
      case 'warning':
        return <WarningIcon color="error" />;
      default:
        return <NotificationsIcon color="action" />;
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const unreadCount = notifications.filter(notification => !notification.isRead).length;
  
  return (
    <Paper elevation={3} sx={{ mb: 3, overflow: 'hidden' }}>
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#f5f5f5', 
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge badgeContent={unreadCount} color="error" sx={{ mr: 1 }}>
            <NotificationsIcon color="primary" />
          </Badge>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        
        <Tooltip title={expanded ? "Collapse" : "Expand"}>
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? 
              <CheckCircleIcon fontSize="small" /> : 
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            }
          </IconButton>
        </Tooltip>
      </Box>
      
      {expanded && (
        <>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={30} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">No notifications</Typography>
            </Box>
          ) : (
            <>
              <List sx={{ maxHeight: 350, overflow: 'auto' }}>
                {notifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ 
                        backgroundColor: notification.isRead ? 'inherit' : 'rgba(63, 81, 181, 0.08)',
                        transition: 'background-color 0.3s'
                      }}
                      secondaryAction={
                        !notification.isRead && (
                          <Tooltip title="Mark as read">
                            <IconButton edge="end" onClick={() => handleMarkAsRead(notification.id)}>
                              <CheckCircleIcon fontSize="small" color="primary" />
                            </IconButton>
                          </Tooltip>
                        )
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: notification.isRead ? '#e0e0e0' : '#bbdefb' }}>
                          {getNotificationIcon(notification.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography 
                            variant="subtitle2" 
                            sx={{ fontWeight: notification.isRead ? 'regular' : 'bold' }}
                          >
                            {notification.message}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}>
                            {formatDate(notification.createdAt)}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < notifications.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
              
              {unreadCount > 0 && (
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => {
                      notifications
                        .filter(n => !n.isRead)
                        .forEach(n => handleMarkAsRead(n.id));
                    }}
                  >
                    Mark all as read
                  </Button>
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Paper>
  );
};

export default NotificationsPanel; 