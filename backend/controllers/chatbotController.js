import { Op } from "sequelize";
import Events from "../models/Event.js";

export const processChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userMessage = message.toLowerCase();
    
    // Enhanced response logic with database queries
    if (userMessage.includes('upcoming events') || userMessage.includes('events soon')) {
      // Get upcoming events from database
      const upcomingEvents = await Events.findAll({
        where: {
          startDate: {
            [Op.gt]: new Date()
          }
        },
        limit: 3,
        order: [['startDate', 'ASC']]
      });
      
      if (upcomingEvents.length > 0) {
        const eventsList = upcomingEvents.map(event => 
          `- ${event.title} on ${new Date(event.startDate).toLocaleDateString()}`
        ).join('\n');
        
        return res.json({
          response: `Here are some upcoming events:\n${eventsList}`
        });
      } else {
        return res.json({
          response: "There are no upcoming events at the moment. Check back soon!"
        });
      }
    } else if (userMessage.includes('create event') || userMessage.includes('add event')) {
      return res.json({
        response: "To create an event, go to your organizer dashboard and click on the 'Create Event' button. You'll need to provide details like title, description, date, time, and location."
      });
    } else if (userMessage.includes('register') || userMessage.includes('sign up for event')) {
      return res.json({
        response: "To register for an event, browse the events page, select an event you're interested in, and click the 'Register' button. You'll need to be logged in as a customer."
      });
    } else if (userMessage.includes('cancel registration') || userMessage.includes('unregister')) {
      return res.json({
        response: "If you need to cancel your registration, go to your dashboard, find the event under 'My Events', and click 'Cancel Registration'."
      });
    } else if (userMessage.includes('contact') || userMessage.includes('support')) {
      return res.json({
        response: "For additional support, please email us at support@gather.com or call us at (555) 123-4567."
      });
    } else if (userMessage.includes('hello') || userMessage.includes('hi')) {
      return res.json({
        response: "Hello! How can I assist you with Gather today?"
      });
    }
    
    // Default response
    return res.json({
      response: "I'm not sure I understand. Could you rephrase your question? You can ask about upcoming events, creating events, registering for events, or managing your account."
    });
    
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ message: "Error processing your request" });
  }
};