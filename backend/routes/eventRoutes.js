import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  upload,
} from "../controllers/eventController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
// Get all events
router.get("/", getAllEvents);

// Get single event
router.get("/:id", getEventById);

// Protected routes
// Create event with file upload (requires authentication)
router.post("/", verifyToken, upload.single("banner"), createEvent);

// Update event with optional file upload (requires authentication)
router.put("/:id", verifyToken, upload.single("banner"), updateEvent);

// Delete event (requires authentication)
router.delete("/:id", verifyToken, deleteEvent);

export default router;
