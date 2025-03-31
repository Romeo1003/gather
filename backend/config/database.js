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

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(caPath),
      },
    },
    logging: false, // Disable logging SQL queries in the console
  }
);

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
