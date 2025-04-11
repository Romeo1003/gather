import express from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { 
  getDashboardStats,
  getAllUsers,
  getUserByEmail,
  updateUserRole,
  deleteUser,
  handleEventRequest,
  getSystemLogs,
  createNotification,
  getNotifications,
  markNotificationAsRead,
  checkNewNotifications
} from "../controllers/adminController.js";

const router = express.Router();

// Protect all admin routes with authentication and admin role check
router.use(verifyToken, isAdmin);

// Dashboard stats
router.get("/dashboard-stats", getDashboardStats);

// User management
router.get("/users", getAllUsers);
router.get("/users/:email", getUserByEmail);
router.put("/users/:email/role", updateUserRole);
router.delete("/users/:email", deleteUser);

// Event request management
router.post("/requests/:requestId", handleEventRequest);

// System logs
router.get("/logs", getSystemLogs);

// Notification routes
router.post("/notifications", createNotification);
router.get("/notifications", getNotifications);
router.get("/notifications/check", checkNewNotifications);
router.put("/notifications/:id/read", markNotificationAsRead);

export default router; 