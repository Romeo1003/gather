import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Skeleton, CircularProgress } from '@mui/material';
import { 
  WbSunny as SunnyIcon, 
  Cloud as CloudyIcon,
  Opacity as RainIcon,
  AcUnit as SnowIcon,
  Bolt as ThunderstormIcon,
  RemoveRedEye as MistIcon 
} from '@mui/icons-material';

const weatherIcons = {
  'Clear': <SunnyIcon sx={{ color: '#FFB300', fontSize: 32 }} />,
  'Clouds': <CloudyIcon sx={{ color: '#78909C', fontSize: 32 }} />,
  'Rain': <RainIcon sx={{ color: '#42A5F5', fontSize: 32 }} />,
  'Snow': <SnowIcon sx={{ color: '#90CAF9', fontSize: 32 }} />,
  'Thunderstorm': <ThunderstormIcon sx={{ color: '#5C6BC0', fontSize: 32 }} />,
  'Mist': <MistIcon sx={{ color: '#B0BEC5', fontSize: 32 }} />,
  'default': <CloudyIcon sx={{ color: '#78909C', fontSize: 32 }} />
};

const WeatherWidget = ({ location, date, size = 'medium' }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // For demonstration purposes, we'll use mock data instead of a real API call
    // In a real app, you would use something like:
    // fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=YOUR_API_KEY&units=metric`)
    
    const fetchMockWeather = () => {
      setLoading(true);
      
      // Generate mock weather data
      setTimeout(() => {
        const conditions = ['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm', 'Mist'];
        const mockWeather = {
          main: {
            temp: Math.floor(Math.random() * 30) + 5, // Random temp between 5-35°C
            humidity: Math.floor(Math.random() * 60) + 30, // Random humidity between 30-90%
          },
          weather: [{
            main: conditions[Math.floor(Math.random() * conditions.length)]
          }],
          wind: {
            speed: Math.floor(Math.random() * 30) + 5, // Random wind speed
          }
        };
        
        setWeather(mockWeather);
        setLoading(false);
      }, 1000);
    };
    
    if (location) {
      fetchMockWeather();
    } else {
      setError('Location not provided');
      setLoading(false);
    }
  }, [location]);

  // Size variants
  const sizes = {
    small: {
      paper: { p: 1 },
      icon: { fontSize: 24 },
      tempText: { fontSize: '1rem' },
      locationText: { fontSize: '0.75rem' },
      detailsText: { fontSize: '0.7rem' },
    },
    medium: {
      paper: { p: 2 },
      icon: { fontSize: 32 },
      tempText: { fontSize: '1.25rem' },
      locationText: { fontSize: '0.875rem' },
      detailsText: { fontSize: '0.75rem' },
    },
    large: {
      paper: { p: 3 },
      icon: { fontSize: 48 },
      tempText: { fontSize: '1.5rem' },
      locationText: { fontSize: '1rem' },
      detailsText: { fontSize: '0.875rem' },
    }
  };

  const sizeProps = sizes[size] || sizes.medium;

  if (loading) {
    return (
      <Paper elevation={1} sx={{ ...sizeProps.paper, display: 'flex', alignItems: 'center' }}>
        <CircularProgress size={20} sx={{ mr: 1 }} />
        <Typography>Loading weather...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={1} sx={{ ...sizeProps.paper, bgcolor: '#FFF4E5' }}>
        <Typography color="error" variant="body2">{error}</Typography>
      </Paper>
    );
  }

  if (!weather) {
    return null;
  }

  const weatherMain = weather.weather[0].main;
  const weatherIcon = weatherIcons[weatherMain] || weatherIcons.default;
  
  const eventDate = date ? new Date(date) : new Date();
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <Paper elevation={1} sx={{ ...sizeProps.paper, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={sizeProps.locationText}>
            {location}
          </Typography>
          <Typography variant="h6" sx={sizeProps.tempText}>
            {weather.main.temp}°C
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={sizeProps.detailsText}>
            {formattedDate}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {weatherIcon}
          <Typography variant="caption" sx={sizeProps.detailsText}>
            {weatherMain}
          </Typography>
        </Box>
      </Box>
      
      {size !== 'small' && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={sizeProps.detailsText}>
            Humidity: {weather.main.humidity}%
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={sizeProps.detailsText}>
            Wind: {weather.wind.speed} km/h
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default WeatherWidget; 