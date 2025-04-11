import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Load environment variables
dotenv.config();

// Get the directory name in ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to the CA certificate file
const caPath = path.join(__dirname, "ca.pem");

// Check if we're in development mode and use SQLite in-memory database
const isDevMode = process.env.NODE_ENV !== 'production';

let sequelize;

// Always use SQLite for Docker deployment
const useSqlite = true; // Changed to always use SQLite

if (useSqlite) {
  console.log("🔧 Using SQLite database for development");
  
  // Use file-based SQLite instead of in-memory for persistence
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite", // Store in a file instead of memory
    logging: false,
  });
} else {
  // This branch won't be used, but kept for reference
  console.log("🔧 Using MySQL database for production");
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      logging: false,
    }
  );
}

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully with Sequelize");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();

export default sequelize;
