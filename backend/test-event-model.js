import Events from './models/Event.js';
import sequelize from './config/database.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testEventModel() {
  try {
    console.log("Testing database connection...");
    await sequelize.authenticate();
    console.log("Database connection successful!");
    
    console.log("Testing Event model...");
    console.log("Model definition:", Events);
    
    // Synchronize the model with the database to ensure table exists
    // use {force: false} to avoid dropping existing tables
    await Events.sync({ force: false });
    console.log("Events table synchronized successfully");
    
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