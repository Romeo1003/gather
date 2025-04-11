import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Badge,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Payments as PaymentsIcon,
  Notifications as NotificationsIcon,
  CheckCircle as ApproveIcon,
  InfoOutlined as InfoIcon,
  Visibility as ViewIcon,
  CancelOutlined as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const PaymentApprovalPanel = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // Load pending payments on component mount
  useEffect(() => {
    fetchPendingPayments();
    
    // Simulate new notification every 30 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newNotification = {
          id: Date.now(),
          message: `New payment received for $${(Math.random() * 200 + 50).toFixed(2)}`,
          timestamp: new Date()
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Fetch pending payments
  const fetchPendingPayments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/payments/admin/pending`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setPendingPayments(response.data.payments || []);
    } catch (err) {
      console.error('Error fetching pending payments:', err);
      setError(err.response?.data?.message || 'Failed to load pending payments');
    } finally {
      setLoading(false);
    }
  };
  
  // Open approval dialog
  const handleOpenApprovalDialog = (payment) => {
    setSelectedPayment(payment);
    setApprovalNotes('');
    setApprovalDialogOpen(true);
  };
  
  // Open details dialog
  const handleOpenDetailsDialog = (payment) => {
    setSelectedPayment(payment);
    setDetailsDialogOpen(true);
  };
  
  // Close dialogs
  const handleCloseDialogs = () => {
    setApprovalDialogOpen(false);
    setDetailsDialogOpen(false);
    setSelectedPayment(null);
  };
  
  // Process payment approval
  const handleApprovePayment = async () => {
    if (!selectedPayment) return;
    
    setApprovalLoading(true);
    
    try {
      await axios.post(`${API_URL}/payments/admin/approve/${selectedPayment.id}`, {
        notes: approvalNotes
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      // Remove approved payment from the list
      setPendingPayments(pendingPayments.filter(p => p.id !== selectedPayment.id));
      handleCloseDialogs();
      
      // Add approval notification
      const newNotification = {
        id: Date.now(),
        message: `Payment for ${selectedPayment.invite.event.title} approved`,
        type: 'success',
        timestamp: new Date()
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    } catch (err) {
      console.error('Error approving payment:', err);
      setError(err.response?.data?.message || 'Failed to approve payment');
    } finally {
      setApprovalLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Clear notification
  const handleClearNotification = (notificationId) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PaymentsIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Payment Approvals</Typography>
        </Box>
        
        <Tooltip title="Payment Notifications">
          <Badge 
            badgeContent={notifications.length} 
            color="error"
            sx={{ mr: 2 }}
          >
            <IconButton>
              <NotificationsIcon />
            </IconButton>
          </Badge>
        </Tooltip>
      </Box>
      
      {/* Notifications Panel */}
      {notifications.length > 0 && (
        <Paper variant="outlined" sx={{ mb: 3, p: 2, maxHeight: 200, overflow: 'auto' }}>
          <Typography variant="subtitle2" gutterBottom>
            Recent Notifications
          </Typography>
          
          {notifications.map(notification => (
            <Box 
              key={notification.id} 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 1,
                pb: 1,
                borderBottom: '1px solid #eee'
              }}
            >
              <Box>
                <Typography variant="body2">
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(notification.timestamp)}
                </Typography>
              </Box>
              <IconButton 
                size="small" 
                onClick={() => handleClearNotification(notification.id)}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Paper>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {pendingPayments.length === 0 ? (
        <Alert severity="info">
          No pending payments requiring approval.
        </Alert>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Payment ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Event</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.transactionId}</TableCell>
                  <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                  <TableCell>
                    {payment.payingUser?.name || payment.paidBy}
                  </TableCell>
                  <TableCell>
                    {payment.invite?.event?.title || 'Unknown Event'}
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">
                      ${payment.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      size="small" 
                      label={payment.paymentMethod}
                      color={payment.paymentMethod === 'creditCard' ? 'primary' : 'secondary'}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => handleOpenDetailsDialog(payment)}
                      sx={{ mr: 1 }}
                    >
                      Details
                    </Button>
                    <Button
                      size="small"
                      color="success"
                      startIcon={<ApproveIcon />}
                      onClick={() => handleOpenApprovalDialog(payment)}
                    >
                      Approve
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>Approve Payment</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <>
              <Alert severity="info" sx={{ mb: 3 }}>
                Approving this payment will confirm the guest's attendance and send them a confirmation.
              </Alert>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2">Payment Details</Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Transaction ID</Typography>
                    <Typography variant="body1">{selectedPayment.transactionId}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Amount</Typography>
                    <Typography variant="body1" fontWeight="bold">${selectedPayment.amount.toFixed(2)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                    <Typography variant="body1">{selectedPayment.paymentMethod}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Date</Typography>
                    <Typography variant="body1">{formatDate(selectedPayment.paymentDate)}</Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2">Guest Information</Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{selectedPayment.paidBy}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Invite Code</Typography>
                    <Typography variant="body1" fontFamily="monospace">{selectedPayment.invite?.code}</Typography>
                  </Box>
                </Box>
              </Box>
              
              <TextField
                label="Approval Notes (Optional)"
                multiline
                rows={3}
                fullWidth
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                variant="outlined"
                placeholder="Add optional notes or comments about this approval"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button 
            onClick={handleApprovePayment} 
            variant="contained" 
            color="success"
            disabled={approvalLoading}
            startIcon={approvalLoading ? <CircularProgress size={20} /> : <ApproveIcon />}
          >
            {approvalLoading ? 'Processing...' : 'Approve Payment'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Payment Information
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">Transaction ID</Typography>
                      <Typography variant="body1" fontFamily="monospace">{selectedPayment.transactionId}</Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">Amount</Typography>
                      <Typography variant="h6" color="primary">${selectedPayment.amount.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                      <Typography variant="body1">{selectedPayment.paymentMethod}</Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">Payment Date</Typography>
                      <Typography variant="body1">{formatDate(selectedPayment.paymentDate)}</Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">Status</Typography>
                      <Chip 
                        label={selectedPayment.status}
                        color={selectedPayment.status === 'completed' ? 'success' : 'warning'}
                      />
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Event Information
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">Event Name</Typography>
                      <Typography variant="body1">{selectedPayment.invite?.event?.title}</Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">Event Date</Typography>
                      <Typography variant="body1">
                        {selectedPayment.invite?.event?.startDate && 
                          new Date(selectedPayment.invite.event.startDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">Guest Email</Typography>
                      <Typography variant="body1">{selectedPayment.paidBy}</Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">Invite Code</Typography>
                      <Typography variant="body1" fontFamily="monospace">{selectedPayment.invite?.code}</Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Close</Button>
          <Button 
            onClick={() => {
              handleCloseDialogs();
              handleOpenApprovalDialog(selectedPayment);
            }}
            variant="contained" 
            color="success"
            startIcon={<ApproveIcon />}
          >
            Proceed to Approval
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PaymentApprovalPanel; 