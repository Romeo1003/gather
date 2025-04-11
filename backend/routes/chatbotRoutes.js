import express from 'express';
import { 
  processChatQuery, 
  getChatSuggestions, 
  getFilteredEvents 
} from '../controllers/chatbotController.js';

const router = express.Router();

// Public routes - accessible without authentication
router.post('/query', processChatQuery);
router.get('/suggestions', getChatSuggestions);
router.get('/filtered-events', getFilteredEvents);

export default router; 