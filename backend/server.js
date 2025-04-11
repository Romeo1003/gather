import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./config/database.js";
import eventRoutes from "./routes/eventRoutes.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import venueRoutes from "./routes/venueRoutes.js";
import inviteRoutes from "./routes/inviteRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import seedVenues from "./seeders/venueSeeder.js";

// Import model associations to ensure they're defined
try {
  // Try to import models/index.js but don't crash if there are issues
  await import('./models/index.js');
  console.log("✅ Model associations defined");
} catch (error) {
  console.error("❌ Error in model associations:", error.message);
  // Continue execution even if models have issues
}

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true,
  })
);

// Static files - Make images accessible from frontend
app.use('/user_uploads', express.static(path.join(__dirname, 'public', 'user_uploads')));

// Database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established");
    console.log("✅ Database connected successfully with Sequelize");
    
    // Sync database with models
    await sequelize.sync({ force: false, alter: false });
    console.log("✅ All models synchronized successfully");
    
    // Seed venues if needed
    const venueCount = await sequelize.models.Venue.count();
    if (venueCount === 0) {
      console.log("🌱 No venues found, seeding initial venues...");
      await seedVenues();
    } else {
      console.log(`✅ Database already has ${venueCount} venues`);
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    console.log("🔧 Using SQLite database for development");
    // Continue execution even if database connection fails
  }
})();

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ status: "success", message: "API is working!" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Error Stack:", err.stack);
  console.error("Error Details:", err.message);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Press CTRL+C to stop the server");
});
