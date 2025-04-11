import express from 'express';
import { 
  processPayment, 
  getPaymentDetails, 
  approvePayment, 
  getPendingPayments 
} from '../controllers/paymentController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All payment routes require authentication
router.use(verifyToken);

// Routes for all authenticated users
router.post('/process', processPayment);
router.get('/:id', getPaymentDetails);

// Admin-only routes
router.get('/admin/pending', isAdmin, getPendingPayments);
router.post('/admin/approve/:id', isAdmin, approvePayment);

export default router; 