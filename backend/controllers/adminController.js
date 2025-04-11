import User from '../models/User.js';
import Events from '../models/Event.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    // Count total events
    const totalEvents = await Events.count();
    
    // Count active events
    const activeEvents = await Events.count({
      where: {
        endDate: {
          [Op.gt]: new Date()
        }
      }
    });
    
    // Count total users
    const totalUsers = await User.count();
    
    // Count admin users
    const adminUsers = await User.count({
      where: {
        role: 'admin'
      }
    });
    
    // Count customer users
    const customerUsers = await User.count({
      where: {
        role: 'customer'
      }
    });
    
    res.status(200).json({
      totalEvents,
      activeEvents,
      completedEvents: totalEvents - activeEvents,
      totalUsers,
      adminUsers,
      customerUsers,
      // For now we'll mock the pending requests count
      pendingRequests: 2
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Failed to get dashboard stats', error: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['email', 'name', 'role', 'creation_date', 'profile_visibility']
    });
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
};

// Get user by email
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await User.findOne({
      where: { email },
      attributes: ['email', 'name', 'role', 'creation_date', 'profile_visibility']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { email } = req.params;
    const { role } = req.body;
    
    if (!role || !['admin', 'customer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent changing the role of the last admin
    if (user.role === 'admin' && role === 'customer') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot change role of the last admin' });
      }
    }
    
    user.role = role;
    await user.save();
    
    res.status(200).json({ message: 'User role updated', user: {
      email: user.email,
      name: user.name,
      role: user.role
    }});
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Failed to update user role', error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin' });
      }
    }
    
    await user.destroy();
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

// Handle event requests (approve or reject)
export const handleEventRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action, reason } = req.body;
    
    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }
    
    // In a real app, you would fetch the request from database
    // For now, we'll return a mock response
    res.status(200).json({
      message: `Request ${requestId} has been ${action === 'approve' ? 'approved' : 'rejected'}`,
      requestId,
      status: action === 'approve' ? 'approved' : 'rejected',
      reason: reason || ''
    });
  } catch (error) {
    console.error('Error handling event request:', error);
    res.status(500).json({ message: 'Failed to handle event request', error: error.message });
  }
};

// Get system logs (mock function)
export const getSystemLogs = async (req, res) => {
  try {
    // In a real app, you would fetch logs from a logging system
    // For now, we'll return mock data
    const logs = [
      { timestamp: new Date(), level: 'info', message: 'System started', user: 'system' },
      { timestamp: new Date(Date.now() - 60000), level: 'info', message: 'User signed in', user: 'admin@gather.com' },
      { timestamp: new Date(Date.now() - 120000), level: 'warning', message: 'Failed login attempt', user: 'unknown' },
      { timestamp: new Date(Date.now() - 180000), level: 'error', message: 'Database connection error', user: 'system' },
      { timestamp: new Date(Date.now() - 240000), level: 'info', message: 'Event created', user: 'maya@gmail.com' }
    ];
    
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error getting system logs:', error);
    res.status(500).json({ message: 'Failed to get system logs', error: error.message });
  }
};

// Store admin notifications (in a real app, these would be stored in the database)
const adminNotifications = [];

// Create a new notification for admins
export const createNotification = async (req, res) => {
  try {
    const { type, message, eventId } = req.body;
    
    if (!type || !message) {
      return res.status(400).json({ message: 'Type and message are required' });
    }
    
    // Create a new notification
    const notification = {
      id: Date.now().toString(),
      type,
      message,
      eventId: eventId || null,
      createdAt: new Date(),
      isRead: false
    };
    
    // In a real application, save this to the database
    adminNotifications.unshift(notification); // Add to beginning of array
    
    // Keep only latest 100 notifications
    if (adminNotifications.length > 100) {
      adminNotifications.pop();
    }
    
    res.status(201).json({ 
      message: 'Notification created successfully',
      notification 
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      message: 'Failed to create notification',
      error: error.message
    });
  }
};

// Get all admin notifications
export const getNotifications = async (req, res) => {
  try {
    res.status(200).json(adminNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notificationIndex = adminNotifications.findIndex(n => n.id === id);
    
    if (notificationIndex === -1) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Update notification
    adminNotifications[notificationIndex].isRead = true;
    
    res.status(200).json({ 
      message: 'Notification marked as read',
      notification: adminNotifications[notificationIndex]
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

// Check for new notifications
export const checkNewNotifications = async (req, res) => {
  try {
    const unreadCount = adminNotifications.filter(n => !n.isRead).length;
    
    res.status(200).json({
      hasNewNotifications: unreadCount > 0,
      unreadCount
    });
  } catch (error) {
    console.error('Error checking notifications:', error);
    res.status(500).json({
      message: 'Failed to check for new notifications',
      error: error.message
    });
  }
}; 