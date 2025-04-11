import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create an in-memory SQLite database for testing
const sequelize = new Sequelize('sqlite::memory:', {
  logging: console.log
});

// Define the Events model directly here (copy from Event.js but use the local sequelize instance)
const Events = sequelize.define(
  "Events",
  {
    id: {
      type: DataTypes.STRING(6),
      primaryKey: true,
      allowNull: false,
      field: "id",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "title",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "description",
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "start_date",
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "end_date",
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "time",
    },
    registered: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: "registered",
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "image",
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
      field: "price",
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "location",
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeValidate: (event) => {
        if (!event.id) {
          event.id = generateEventId();
        }
      }
    }
  }
);

// Function to generate 6-digit alphanumeric ID
function generateEventId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function testEventModel() {
  try {
    console.log("Testing database connection...");
    await sequelize.authenticate();
    console.log("Database connection successful!");
    
    console.log("Testing Event model...");
    
    // Synchronize the model with the database to ensure table exists
    // Use {force: true} for SQLite in-memory database
    await Events.sync({ force: true });
    console.log("Events table created successfully");
    
    // Create a test event
    const testEvent = await Events.create({
      title: "Test Event",
      description: "This is a test event",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      time: "10:00 AM - 4:00 PM",
      location: "Test Location"
    });
    
    console.log("Created test event:", testEvent.toJSON());
    
    // Retrieve all events
    const allEvents = await Events.findAll();
    console.log(`Found ${allEvents.length} events in database`);
    
  } catch (error) {
    console.error("Error testing Event model:", error);
  } finally {
    // Close the database connection
    await sequelize.close();
    console.log("Database connection closed");
  }
}

testEventModel(); 