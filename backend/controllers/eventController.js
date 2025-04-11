import Event from "../models/Event.js";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

// Define the upload directory
const uploadDir = path.join(process.cwd(), "public", "user_uploads");

// Ensure the directory exists before uploading files
const ensureUploadDir = async () => {
  try {
    await fs.access(uploadDir);
  } catch (error) {
    await fs.mkdir(uploadDir, { recursive: true });
  }
};

// Set up Multer storage
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    await ensureUploadDir();
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Configure Multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
});

// Create Event
export const createEvent = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    const { 
      title, 
      description, 
      startDate, 
      endDate, 
      time, 
      location, 
      price, 
      capacity,
      requiredServices,
      status,
      organizerEmail
    } = req.body;

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    // Get user information from the request
    const userEmail = req.user?.email || organizerEmail;
    const userRole = req.user?.role || 'customer';

    // Initialize event data
    const eventData = {
      title,
      description,
      startDate,
      endDate,
      time,
      location,
      price: price || 0,
      capacity: capacity || null,
      availableCapacity: capacity || null,
      organizerEmail: userEmail,
    };

    // Handle required services if provided
    if (requiredServices) {
      try {
        eventData.requiredServices = typeof requiredServices === 'string' 
          ? JSON.parse(requiredServices) 
          : requiredServices;
      } catch (e) {
        console.error("Error parsing required services:", e);
        // If parsing fails, set to empty array
        eventData.requiredServices = [];
      }
    }

    // Set approval status based on user role
    // Admins can create pre-approved events, users' events need approval
    eventData.status = userRole === 'admin' 
      ? (status || 'published') // Admins can directly publish events
      : 'draft'; // Regular users' events start as drafts

    // Handle image upload
    if (req.file) {
      console.log("File saved at:", req.file.path);
      eventData.image = `${req.protocol}://${req.get("host")}/user_uploads/${req.file.filename}`;
    }

    // Create the event in the database
    const event = await Event.create(eventData);

    // Create notification if user is not admin
    if (userRole !== 'admin') {
      try {
        // Create a notification for admins about the new event
        // This assumes you have a notification model/system
        console.log("Creating notification for new event:", event.id);
        // Implement your notification logic here
      } catch (notificationError) {
        console.error("Error creating notification:", notificationError);
        // Continue even if notification fails
      }
    }

    res.status(201).json({
      success: true,
      message: userRole === 'admin' 
        ? "Event created successfully" 
        : "Event created and pending approval",
      event
    });
  } catch (error) {
    console.error("Create Event Error:", error);

    // If file was uploaded but an error occurred, delete it
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }

    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
};

// Get All Events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
};

// Get Event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const { startDate, endDate } = req.body;

    // Validate dates if they're being updated
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      time: req.body.time,
      location: req.body.location,
      price: req.body.price || 0,
    };

    // Handle file upload if exists
    if (req.file) {
      if (event.image) {
        const oldImagePath = path.join(process.cwd(), "public", event.image);
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.error("Error deleting old file:", err);
        }
      }
      updateData.image = `/user_uploads/${req.file.filename}`;
    }

    await event.update(updateData);
    res.status(200).json(event);
  } catch (error) {
    console.error("Update Event Error:", error);

    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }

    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.image) {
      const imagePath = path.join(process.cwd(), "public", event.image);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }

    await event.destroy();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
};