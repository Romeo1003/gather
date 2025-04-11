import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const PaymentForm = ({ inviteCode, eventDetails, user, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form Validation
  const validateForm = () => {
    if (paymentMethod === 'creditCard') {
      if (!cardNumber || cardNumber.length < 16) {
        setError('Please enter a valid card number');
        return false;
      }
      
      if (!cardName) {
        setError('Please enter the name on the card');
        return false;
      }
      
      if (!expiryDate || !expiryDate.includes('/')) {
        setError('Please enter a valid expiry date (MM/YY)');
        return false;
      }
      
      if (!cvv || cvv.length < 3) {
        setError('Please enter a valid CVV');
        return false;
      }
    }
    
    return true;
  };

  // Handle payment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // For simulation purposes only
      if (cardNumber === '4111111111111111') {
        // This is a test card number, proceed with payment
        const response = await axios.post(`${API_URL}/payments/process`, {
          inviteCode,
          paymentMethod,
          amount: eventDetails.price
        }, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        
        setSuccess(true);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(response.data);
        }
      } else {
        // Simulate card processing issue
        setTimeout(() => {
          setError('Payment failed: Invalid card information or insufficient funds');
          setLoading(false);
        }, 1500);
        return;
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          Payment processed successfully! Your payment is pending approval from the event organizer.
        </Alert>
        <Typography variant="body1" gutterBottom>
          Thank you for your payment. Your place at the event is now confirmed, pending admin approval.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          You will receive a confirmation email once the payment is approved.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Complete Payment
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Event Summary */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Event: {eventDetails.title}
          </Typography>
          <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Date
              </Typography>
              <Typography variant="body1">
                {new Date(eventDetails.startDate).toLocaleDateString()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Amount Due
              </Typography>
              <Typography variant="body1" fontWeight="bold" color="primary">
                ${eventDetails.price.toFixed(2)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Invite Code
              </Typography>
              <Typography variant="body1" fontFamily="monospace">
                {inviteCode}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      
      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
          <FormLabel component="legend">Payment Method</FormLabel>
          <RadioGroup
            name="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            row
          >
            <FormControlLabel 
              value="creditCard" 
              control={<Radio />} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CreditCardIcon sx={{ mr: 1 }} />
                  Credit Card
                </Box>
              }
            />
            <FormControlLabel 
              value="bankTransfer" 
              control={<Radio />} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BankIcon sx={{ mr: 1 }} />
                  Bank Transfer
                </Box>
              } 
            />
          </RadioGroup>
        </FormControl>
        
        {paymentMethod === 'creditCard' && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Card Number"
                fullWidth
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                inputProps={{ maxLength: 19 }}
                placeholder="4111 1111 1111 1111"
                helperText="Use 4111 1111 1111 1111 for testing"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Name on Card"
                fullWidth
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Expiry Date (MM/YY)"
                fullWidth
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                inputProps={{ maxLength: 5 }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="CVV"
                fullWidth
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                type="password"
                inputProps={{ maxLength: 4 }}
                required
              />
            </Grid>
          </Grid>
        )}
        
        {paymentMethod === 'bankTransfer' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" gutterBottom>
              Please use the following details to make a bank transfer:
            </Typography>
            <Typography variant="body2" component="div">
              <Box sx={{ mt: 2 }}>
                <strong>Bank Name:</strong> Demo Bank
              </Box>
              <Box>
                <strong>Account Name:</strong> Event Organizer
              </Box>
              <Box>
                <strong>Account Number:</strong> 123456789
              </Box>
              <Box>
                <strong>Reference:</strong> {inviteCode}
              </Box>
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              For testing, just click "Complete Payment" to simulate a bank transfer.
            </Alert>
          </Box>
        )}
        
        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<PaymentIcon />}
            size="large"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : `Pay $${eventDetails.price.toFixed(2)}`}
          </Button>
        </Box>
        
        <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 2, display: 'block' }}>
          Your payment information is secure and will not be stored.
        </Typography>
      </form>
    </Paper>
  );
};

export default PaymentForm; 