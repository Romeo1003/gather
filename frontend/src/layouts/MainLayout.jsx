import { useTheme } from '../context/ThemeContext.jsx';
import { useServices } from '../context/ServicesContext.jsx';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  const { apiClient } = useServices();

  useEffect(() => {
    console.log('MainLayout mounting');
    apiClient.get('/config')
      .then(({ data }) => console.log('App config:', data))
      .catch(error => console.error('Config fetch error:', error));
  }, [apiClient]);
  const { mode, getMotionProps } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`min-h-screen ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
    >
      <motion.header
        whileHover={{ scale: 1.02 }}
        className={`p-4 shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-blue-600'}`}
      >
        {/* Header content */}
      </motion.header>
      
      <motion.main
        {...getMotionProps()}
        className="container mx-auto p-4"
      >
        <div className="min-h-[80vh]">
          <Outlet />
        </div>
      </motion.main>
    </motion.div>
  );
}