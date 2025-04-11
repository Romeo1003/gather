import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Divider,
  Grid,
  Chip
} from '@mui/material';
import axios from 'axios';
import { 
  VpnKey as KeyIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import PaymentForm from './PaymentForm';

const API_URL = 'http://localhost:5001/api';

const InviteCodeForm = ({ onSuccess, user }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);
  const [showResponse, setShowResponse] = useState(false);
  const [responseOption, setResponseOption] = useState(null);
  const [responseSubmitting, setResponseSubmitting] = useState(false);
  const [responseSuccess, setResponseSuccess] = useState(false);
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      setError('Please enter an invite code');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Verify the invite code
      const response = await axios.post(`${API_URL}/invites/verify`, {
        code: inviteCode
      });
      
      setEventDetails(response.data.event);
      setSuccess(true);
      setShowResponse(true);
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      console.error("Error verifying invite code:", err);
      setError(err.response?.data?.message || 'Invalid invite code. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResponse = async (response) => {
    setResponseOption(response);
    setResponseSubmitting(true);
    
    try {
      const result = await axios.post(`${API_URL}/invites/respond`, {
        code: inviteCode,
        response: response === 'accept' ? 'accepted' : 'declined'
      });
      
      setResponseSuccess(true);
      
      // Check if payment is required
      if (response === 'accept' && result.data.requiresPayment) {
        setPaymentRequired(true);
      }
    } catch (err) {
      console.error("Error responding to invite:", err);
      setError(err.response?.data?.message || 'Failed to process your response. Please try again.');
    } finally {
      setResponseSubmitting(false);
    }
  };
  
  const handleOpenPayment = () => {
    setPaymentDialogOpen(true);
  };
  
  const handlePaymentSuccess = (paymentData) => {
    setPaymentDialogOpen(false);
    
    // In a real application, you would update the UI to show payment confirmed
    if (onSuccess) {
      onSuccess({
        ...eventDetails,
        paymentCompleted: true,
        paymentData
      });
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Have an invite code?
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Typography variant="body2" gutterBottom>
          Enter your invite code to get access to exclusive events
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && !showResponse && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Invite code accepted! Event added to your account.
          </Alert>
        )}
        
        {!success && (
          <>
            <TextField
              fullWidth
              label="Invite Code"
              variant="outlined"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="Enter your invite code (e.g., GATHER2024)"
              required
              InputProps={{
                startAdornment: <KeyIcon color="action" sx={{ mr: 1 }} />,
              }}
              sx={{ mb: 2 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || success}
              sx={{ mt: 1 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify Code'}
            </Button>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              * For demo purposes, try the code shown in your invitations
            </Typography>
          </>
        )}
        
        {/* Event Details & Response Options */}
        {showResponse && eventDetails && (
          <Box sx={{ mt: 3 }}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <EventIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h6">{eventDetails.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {eventDetails.description?.substring(0, 100)}...
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {formatDate(eventDetails.startDate)}
                        {eventDetails.endDate && eventDetails.startDate !== eventDetails.endDate &&
                          ` - ${formatDate(eventDetails.endDate)}`}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{eventDetails.location}</Typography>
                    </Box>
                  </Grid>
                  {eventDetails.price > 0 && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PaymentIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          Price: <strong>${eventDetails.price.toFixed(2)}</strong>
                          {eventDetails.price > 0 && ' (payment required upon acceptance)'}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
            
            {!responseSuccess ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckIcon />}
                  onClick={() => handleResponse('accept')}
                  disabled={responseSubmitting}
                  fullWidth
                >
                  {responseSubmitting && responseOption === 'accept' ? 
                    <CircularProgress size={24} color="inherit" /> : 'Accept Invitation'}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CloseIcon />}
                  onClick={() => handleResponse('decline')}
                  disabled={responseSubmitting}
                  fullWidth
                >
                  {responseSubmitting && responseOption === 'decline' ? 
                    <CircularProgress size={24} color="inherit" /> : 'Decline'}
                </Button>
              </Box>
            ) : (
              <>
                <Alert 
                  severity={paymentRequired ? 'warning' : 'success'} 
                  sx={{ mb: 2 }}
                >
                  {paymentRequired 
                    ? 'Your response has been recorded. Payment is required to complete your registration.' 
                    : 'Your response has been recorded. You are all set!'}
                </Alert>
                
                {paymentRequired && (
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<PaymentIcon />}
                    onClick={handleOpenPayment}
                    fullWidth
                  >
                    Complete Payment
                  </Button>
                )}
              </>
            )}
          </Box>
        )}
      </Box>
      
      {/* Payment Dialog */}
      <Dialog 
        open={paymentDialogOpen} 
        onClose={() => setPaymentDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Complete Your Payment</DialogTitle>
        <DialogContent>
          <PaymentForm 
            inviteCode={inviteCode}
            eventDetails={eventDetails}
            user={user}
            onSuccess={handlePaymentSuccess}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default InviteCodeForm; 