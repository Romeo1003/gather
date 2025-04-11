import express from 'express';
import { 
  createVenue, 
  getAllVenues, 
  getVenueById, 
  updateVenue, 
  deleteVenue 
} from '../controllers/venueController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllVenues);
router.get('/:id', getVenueById);

// Admin-only routes
router.use(verifyToken, isAdmin);
router.post('/', createVenue);
router.put('/:id', updateVenue);
router.delete('/:id', deleteVenue);

export default router; 