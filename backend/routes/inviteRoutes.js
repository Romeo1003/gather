import express from 'express';
import { 
  createInvite, 
  getEventInvites, 
  verifyInvite, 
  respondToInvite, 
  getUserInvites 
} from '../controllers/inviteController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/verify', verifyInvite);
router.post('/respond', respondToInvite);

// Protected routes
router.use(verifyToken);
router.post('/', createInvite);
router.get('/event/:eventId', getEventInvites);
router.get('/user/:email', getUserInvites);

export default router; 