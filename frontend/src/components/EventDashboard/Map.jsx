// src/components/Map.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { LocationOn } from '@mui/icons-material';

// This is a placeholder Map component
// In a real application, you would integrate with a mapping library like Google Maps, Leaflet, etc.
const Map = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#f1f1f1',
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* This is a placeholder - in a real app you'd import an actual map */}
      <img 
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" 
        alt="Map placeholder" 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          opacity: 0.2
        }}
      />
      
      <LocationOn sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
      <Typography variant="body1">
        Map Component
      </Typography>
      <Typography variant="caption" color="text.secondary">
        In a production app, this would be replaced with an actual map integration
      </Typography>
    </Box>
  );
};

export default Map;