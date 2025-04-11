import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Fab,
  Fade,
  Zoom,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Chip,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Avatar,
  Badge
} from '@mui/material';
import {
  ChatBubble as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  Help as HelpIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5001/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'Hello! I\'m the Gather Assistant. How can I help you today?', 
      suggestions: [
        'What events are happening this week?',
        'Show me available venues',
        'How do I book an event?'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    // Focus input when chat is opened
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Reset unread count when chat is opened
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Load initial suggestions from API
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const response = await axios.get(`${API_URL}/chatbot/suggestions`);
        if (response.data && response.data.suggestions) {
          setMessages([
            { 
              sender: 'bot', 
              text: 'Hello! I\'m the Gather Assistant. How can I help you today?', 
              suggestions: response.data.suggestions
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading suggestions:', error);
      }
    };

    loadSuggestions();
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async (text = input) => {
    if (!text.trim()) return;

    // Add user message to chat
    const userMessage = { sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Send message to chatbot API
      const response = await axios.post(`${API_URL}/chatbot/query`, {
        query: text
      });

      // Add bot response after a small delay to simulate typing
      setTimeout(() => {
        setIsTyping(false);
        
        const botResponse = {
          sender: 'bot',
          text: response.data.message,
          suggestions: response.data.suggestions || [],
          data: response.data.data,
          type: response.data.type
        };
        
        setMessages(prev => [...prev, botResponse]);
        
        // If not looking at chat, increment unread count
        if (!isOpen) {
          setUnreadCount(prev => prev + 1);
        }
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      // Add error message
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'bot', 
          text: 'Sorry, I encountered an error. Please try again later.',
          isError: true
        }
      ]);
    }
  };

  const handleReset = () => {
    setMessages([
      { 
        sender: 'bot', 
        text: 'Hello! I\'m the Gather Assistant. How can I help you today?', 
        suggestions: [
          'What events are happening this week?',
          'Show me available venues',
          'How do I book an event?'
        ]
      }
    ]);
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleVenueClick = (venueId) => {
    navigate(`/venues/${venueId}`);
  };

  // Render different types of messages
  const renderMessageContent = (message) => {
    if (message.sender === 'user') {
      return <Typography variant="body1">{message.text}</Typography>;
    }

    // Bot messages with different types of content
    switch (message.type) {
      case 'events':
        return (
          <>
            <Typography variant="body1" mb={1}>{message.text}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {message.data && message.data.map((event) => (
                <Card key={event.id} variant="outlined" sx={{ mb: 1 }}>
                  <CardContent sx={{ p: 2, pb: 0 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {event.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EventIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                      <Typography variant="body2">
                        {new Date(event.startDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                      <Typography variant="body2">{event.location}</Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => handleEventClick(event.id)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </>
        );

      case 'venues':
        return (
          <>
            <Typography variant="body1" mb={1}>{message.text}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {message.data && message.data.map((venue) => (
                <Card key={venue.id} variant="outlined" sx={{ mb: 1 }}>
                  <CardContent sx={{ p: 2, pb: 0 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {venue.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                      <Typography variant="body2">{venue.location}</Typography>
                    </Box>
                    <Typography variant="body2">
                      Capacity: {venue.capacity} guests
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => handleVenueClick(venue.id)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </>
        );

      case 'booking_info':
        return (
          <>
            <Typography variant="body1" mb={1}>{message.text}</Typography>
            <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
              {message.data && message.data.steps.map((step, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText 
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 1
                            }}
                          >
                            {index + 1}
                          </Box>
                          {step}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < message.data.steps.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </>
        );

      case 'help':
        return (
          <>
            <Typography variant="body1" mb={1}>{message.text}</Typography>
            <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1, overflow: 'hidden' }}>
              {message.data && message.data.help_topics.map((topic, index) => (
                <React.Fragment key={index}>
                  <ListItem 
                    button 
                    onClick={() => handleSuggestionClick(topic.command)}
                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <ListItemText 
                      primary={topic.title}
                      secondary={topic.command}
                    />
                    <ArrowForwardIcon fontSize="small" color="action" />
                  </ListItem>
                  {index < message.data.help_topics.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </>
        );

      default:
        return <Typography variant="body1">{message.text}</Typography>;
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Zoom in={true}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000
          }}
        >
          <Badge
            color="error"
            badgeContent={unreadCount}
            invisible={unreadCount === 0}
          >
            <Fab
              color="primary"
              onClick={toggleChat}
              aria-label="chat"
            >
              {isOpen ? <CloseIcon /> : <ChatIcon />}
            </Fab>
          </Badge>
        </Box>
      </Zoom>

      {/* Chat Window */}
      <Fade in={isOpen}>
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 20,
            width: 360,
            height: 500,
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1000,
            borderRadius: 2
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.dark',
                  width: 32,
                  height: 32,
                  mr: 1
                }}
              >
                <ChatIcon fontSize="small" />
              </Avatar>
              <Typography variant="h6">Gather Assistant</Typography>
            </Box>
            <Box>
              <IconButton 
                size="small" 
                color="inherit" 
                onClick={handleReset}
                title="Reset conversation"
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                color="inherit" 
                onClick={toggleChat}
                title="Close chat"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Chat Messages */}
          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              bgcolor: '#f5f5f5'
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '100%'
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    maxWidth: '85%',
                    backgroundColor: 
                      message.sender === 'user' 
                        ? 'primary.main' 
                        : message.isError 
                          ? '#ffebee' 
                          : 'white',
                    color: message.sender === 'user' ? 'white' : 'inherit',
                    borderRadius: 2,
                    borderTopLeftRadius: message.sender === 'user' ? 2 : 0,
                    borderTopRightRadius: message.sender === 'user' ? 0 : 2,
                  }}
                >
                  {renderMessageContent(message)}
                </Paper>

                {/* Suggestions */}
                {message.sender === 'bot' && message.suggestions && message.suggestions.length > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      mt: 1,
                      maxWidth: '100%'
                    }}
                  >
                    {message.suggestions.map((suggestion, i) => (
                      <Chip
                        key={i}
                        label={suggestion}
                        size="small"
                        onClick={() => handleSuggestionClick(suggestion)}
                        clickable
                        color="primary"
                        variant="outlined"
                        sx={{ mb: 0.5 }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            ))}

            {/* Bot is typing indicator */}
            {isTyping && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  alignSelf: 'flex-start'
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    bgcolor: 'white',
                    borderRadius: 2,
                    borderTopLeftRadius: 0
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={12} sx={{ mr: 1 }} />
                    <Typography variant="body2">Assistant is typing...</Typography>
                  </Box>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Chat Input */}
          <Box
            component="form"
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'white'
            }}
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <TextField
              ref={inputRef}
              fullWidth
              size="small"
              placeholder="Type a message..."
              variant="outlined"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              autoComplete="off"
              sx={{
                mr: 1
              }}
            />
            <IconButton
              color="primary"
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isTyping}
              type="submit"
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Fade>
    </>
  );
};

export default Chatbot; 