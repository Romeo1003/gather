export default function ToastService() {
  return <div>Toast Service</div>;
}

import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

// Create a context for the toast service
const ToastContext = createContext(null);

// Toast provider component
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'info', // 'error', 'warning', 'info', 'success'
    duration: 6000,
  });

  const showToast = (message, severity = 'info', duration = 6000) => {
    setToast({
      open: true,
      message,
      severity,
      duration,
    });
  };

  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  // Create a value object with the state and functions
  const contextValue = {
    showToast,
    hideToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.duration}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={hideToast} 
          severity={toast.severity} 
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast service
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Usage example:
// 1. Wrap your app or component with ToastProvider
// 2. In any component:
//    const { showToast } = useToast();
//    showToast('Event created successfully!', 'success');