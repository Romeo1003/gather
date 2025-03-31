import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  upload,
} from "../controllers/eventController.js";

const router = express.Router();

// Create event with file upload
router.post("/", upload.single("banner"), createEvent);

// Get all events
router.get("/", getAllEvents);

// Get single event
router.get("/:id", getEventById);

// Update event with optional file upload
router.put("/:id", upload.single("banner"), updateEvent);

// Delete event
router.delete("/:id", deleteEvent);

export default router;
