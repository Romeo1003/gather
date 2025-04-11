import express from 'express';
import {
  createEventRequest,
  getMyEventRequests,
  getEventRequestById,
  updateEventRequest,
  cancelEventRequest,
  processPayment,
  sendInvite,
  verifyInviteCode,
  addGuest,
  updateGuestStatus,
  getAllEventRequests,
  updateEventRequestStatus,
  getEventRequestStats
} from '../controllers/eventRequestController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/invites/verify', verifyInviteCode);

// Protected routes
router.route('/')
  .post(protect, createEventRequest)
  .get(protect, getMyEventRequests);

router.route('/:id')
  .get(protect, getEventRequestById)
  .put(protect, updateEventRequest);

router.route('/:id/cancel')
  .put(protect, cancelEventRequest);

router.route('/:id/pay')
  .post(protect, processPayment);

router.route('/:id/invite')
  .post(protect, sendInvite);

router.route('/:id/guests')
  .post(protect, addGuest);

router.route('/:id/guests/:guestId')
  .put(protect, updateGuestStatus);

// Admin routes
router.route('/admin/all')
  .get(protect, admin, getAllEventRequests);

router.route('/:id/status')
  .put(protect, admin, updateEventRequestStatus);

router.route('/admin/stats')
  .get(protect, admin, getEventRequestStats);

export default router; 