import { createContext, useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const ThemeContext = createContext({
  mode: 'light',
  toggleMode: () => {},
  motionEffects: true,
  motionConfig: {
    stiffness: 100,
    damping: 10,
    mass: 0.5
  },
  toggleMotion: () => {},
  getMotionProps: () => ({})
});

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  const [motionEffects, setMotionEffects] = useState(true);

  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleMotion = () => {
    setMotionEffects(prev => {
      // Reset animations when toggling motion
      if (!prev) document.body.getAnimations().forEach(anim => anim.cancel());
      return !prev;
    });
  };

  const getMotionProps = () => motionEffects ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  } : {};

  return (
    <ThemeContext.Provider value={{ 
    mode, 
    toggleMode, 
    motionEffects, 
    motionConfig: {
      stiffness: 100,
      damping: 10,
      mass: 0.5
    },
    toggleMotion,
    getMotionProps
  }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);