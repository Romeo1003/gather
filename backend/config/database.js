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

// Get database configuration from environment variables
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

// Initialize Sequelize
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    // Disable SSL by default unless explicitly enabled
    ssl: false
  }
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("🔌 Database connected successfully with Sequelize");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();

export default sequelize;
