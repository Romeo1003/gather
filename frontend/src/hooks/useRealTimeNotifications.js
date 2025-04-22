import { useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import websocketService from '../services/websocketService';

export const useRealTimeNotifications = () => {
  const { showNotification } = useNotification();

  useEffect(() => {
    const handleNotification = (data) => {
      showNotification(data.message, data.severity);
    };

    websocketService.subscribe('notification', handleNotification);
    
    return () => {
      websocketService.unsubscribe('notification', handleNotification);
    };
  }, [showNotification]);
};