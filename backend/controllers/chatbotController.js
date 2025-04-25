import { Events, Venue } from '../models/index.js';
import { Op } from 'sequelize';

// Process chatbot queries
export const processChatQuery = async (req, res) => {
  try {
    const { query, userId } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    // Initialize response
    let response = {
      message: '',
      suggestions: [],
      data: null,
      type: 'text'
    };

    // Load NLP model
    const model = await loadNLPModel();
    
    // Classify query using NLP model
    const classification = await classifyQuery(model, query);
    
    // Handle fallback to keyword matching
    const { intent, confidence } = classification;
    const useKeywordFallback = confidence < 0.65;

    // Log processing approach
    logger.info(`Processing query with ${useKeywordFallback ? 'keyword fallback' : 'NLP model'}`, { 
      intent, 
      confidence: confidence.toFixed(2),
      queryLength: query.length 
    });
    
    // Handle detected intent
    if (intent === 'event_query' || useKeywordFallback && lowercaseQuery.match(/event|happening|what|show me/i)) {
      
      // Process date filtering if present
      let dateFilter = null;
      
      if (lowercaseQuery.includes('today')) {
        const today = new Date();
        dateFilter = {
          startDate: {
            [Op.lte]: new Date(today.setHours(23, 59, 59, 999)),
          },
          endDate: {
            [Op.gte]: new Date(today.setHours(0, 0, 0, 0)),
          }
        };
      } else if (lowercaseQuery.includes('tomorrow')) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateFilter = {
          startDate: {
            [Op.lte]: new Date(tomorrow.setHours(23, 59, 59, 999)),
          },
          endDate: {
            [Op.gte]: new Date(tomorrow.setHours(0, 0, 0, 0)),
          }
        };
      } else if (lowercaseQuery.includes('this week') || lowercaseQuery.includes('upcoming')) {
        const today = new Date();
        const endOfWeek = new Date();
        endOfWeek.setDate(today.getDate() + 7);
        
        dateFilter = {
          startDate: {
            [Op.gte]: today,
            [Op.lte]: endOfWeek
          }
        };
      } else if (lowercaseQuery.includes('month')) {
        const today = new Date();
        const endOfMonth = new Date();
        endOfMonth.setMonth(today.getMonth() + 1);
        
        dateFilter = {
          startDate: {
            [Op.gte]: today,
            [Op.lte]: endOfMonth
          }
        };
      }
      
      // Query events based on filters
      let events = [];
      try {
        const where = dateFilter || {};
        
        events = await Events.findAll({ 
          where,
          limit: 5,
          order: [['startDate', 'ASC']]
        });
        
        if (events.length > 0) {
          response.message = `Here are some events ${dateFilter ? 'for the requested time period' : ''}:`;
          response.type = 'events';
          response.data = events;
          response.suggestions = [
            'Tell me more about venues',
            'How do I book an event?',
            'Show me events next month'
          ];
        } else {
          response.message = 'I couldn\'t find any events for that time period. Would you like to see all upcoming events?';
          response.suggestions = [
            'Show all events',
            'Show events this month',
            'Show available venues'
          ];
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        response.message = 'Sorry, I had trouble finding events. Please try again later.';
      }
      
    }
    // Handle venue intent
    else if (intent === 'venue_query' || useKeywordFallback && lowercaseQuery.match(/venue|location|where|place/i)) {
      
      try {
        const venues = await Venue.findAll({
          include: [
            {
              model: Events,
              as: 'events',
              attributes: ['id', 'title', 'startDate', 'endDate']
            }
          ],
          limit: 5
        });
        
        if (venues.length > 0) {
          response.message = 'Here are some available venues:';
          response.type = 'venues';
          response.data = venues;
          response.suggestions = [
            'Show me more venues',
            'How do I book a venue?',
            'What events are coming up?'
          ];
        } else {
          response.message = 'I couldn\'t find any venues at the moment. Please check back later.';
          response.suggestions = [
            'Show me events instead',
            'How do I create an event?',
            'Help'
          ];
        }
      } catch (error) {
        console.error('Error fetching venues:', error);
        response.message = 'Sorry, I had trouble finding venues. Please try again later.';
      }
    }
    // Handle booking intent
    else if (intent === 'booking_query' || useKeywordFallback && lowercaseQuery.match(/book|reserve|registration|register/i)) {
      
      response.message = 'To book an event or venue, you can:';
      response.type = 'booking_info';
      response.data = {
        steps: [
          'Browse available events or venues',
          'Select the one you\'re interested in',
          'Click on "Register" or "Book Now"',
          'Fill out the required details',
          'Complete any payment if necessary'
        ]
      };
      response.suggestions = [
        'Show me available events',
        'Show me available venues',
        'What are the payment options?'
      ];
    }
    // Handle help intent
    else if (intent === 'help_query' || useKeywordFallback && lowercaseQuery.match(/help|how to|guide|assist/i)) {
      
      response.message = 'I can help you with the following:';
      response.type = 'help';
      response.data = {
        help_topics: [
          { title: 'Finding Events', command: 'Show me events' },
          { title: 'Exploring Venues', command: 'Show available venues' },
          { title: 'Booking Process', command: 'How do I book an event?' },
          { title: 'Registration Help', command: 'Help with registration' },
          { title: 'Payment Issues', command: 'Payment options' }
        ]
      };
      response.suggestions = [
        'Show me events',
        'Show available venues',
        'How do I book an event?'
      ];
    }
    // Payment related queries
    else if (lowercaseQuery.includes('payment') || 
             lowercaseQuery.includes('cost') || 
             lowercaseQuery.includes('price') ||
             lowercaseQuery.includes('fee')) {
      
      response.message = 'We accept various payment methods including credit/debit cards and online transfers. Most events display their prices on their detail pages. Some events are free to attend!';
      response.suggestions = [
        'Show me free events',
        'How do I book an event?',
        'Show me upcoming events'
      ];
    }
    // Default fallback response
    else {
      response.message = "I'm not sure I understand. You can ask me about events, venues, or how to book them. How can I help you today?";
      response.suggestions = [
        'Show me upcoming events',
        'Show available venues',
        'How do I book an event?',
        'Help'
      ];
    }

    // Log the interaction (in a real app, this could be saved to a database)
    console.log(`User query: ${query}`);
    console.log(`Bot response: ${response.message}`);

    // Return the chatbot response
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      message: 'Sorry, I encountered an error processing your request.',
      error: error.message
    });
  }
};

// Get available suggestions for chat
export const getChatSuggestions = async (req, res) => {
  try {
    // Return a list of common suggestions users can ask the chatbot
    const suggestions = [
      'What events are happening this week?',
      'Show me available venues',
      'How do I book an event?',
      'What events are happening today?',
      'Tell me about payment options'
    ];
    
    res.status(200).json({ suggestions });
    
  } catch (error) {
    console.error('Error getting chat suggestions:', error);
    res.status(500).json({
      message: 'Failed to get chat suggestions',
      error: error.message
    });
  }
};

// Get filtered events (by date, category, etc.) for chatbot responses
export const getFilteredEvents = async (req, res) => {
  try {
    const { startDate, endDate, category, priceRange } = req.query;
    
    // Build the filter conditions
    const whereConditions = {};
    
    if (startDate && endDate) {
      whereConditions.startDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereConditions.startDate = {
        [Op.gte]: new Date(startDate)
      };
    }
    
    if (category) {
      whereConditions.category = category;
    }
    
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      whereConditions.price = {
        [Op.between]: [parseFloat(min), parseFloat(max)]
      };
    }
    
    // Query events with filters
    const events = await Events.findAll({
      where: whereConditions,
      limit: 10,
      order: [['startDate', 'ASC']]
    });
    
    res.status(200).json(events);
    
  } catch (error) {
    console.error('Error getting filtered events:', error);
    res.status(500).json({
      message: 'Failed to get filtered events',
      error: error.message
    });
  }
};