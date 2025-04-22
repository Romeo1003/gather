import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats/dashboard`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const fetchEventStats = async (eventId) => {
  try {
    const response = await axios.get(`${API_URL}/stats/events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching event stats:', error);
    throw error;
  }
};

export const fetchUserStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};