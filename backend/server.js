import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./config/database.js";
import eventRoutes from "./routes/eventRoutes.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
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
    await sequelize.sync({ force: false, alter: false });
    console.log("✅ All models synchronized successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
})();

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

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
