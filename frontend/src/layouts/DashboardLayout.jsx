import { useTheme } from '../context/ThemeContext.jsx';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  const { mode, motionConfig, getMotionProps } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={motionConfig}
      className={`flex min-h-screen ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <motion.aside
        whileHover={{ width: 256 }}
        className={`p-4 shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
      >
        {/* Sidebar content */}
      </motion.aside>

      <motion.main
        {...getMotionProps()}
        className="flex-1 p-6 overflow-auto"
      >
        <Outlet />
      </motion.main>
    </motion.div>
  );
}