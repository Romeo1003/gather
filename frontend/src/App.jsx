import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import theme from './theme';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersList from './pages/admin/UsersList';
import EventsList from './pages/admin/EventsList';
import Settings from './pages/admin/Settings';
import Unauthorized from './pages/Unauthorized';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import SignInPage from './pages/SignInPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import AllEvents from './pages/customer/AllEvents';
import OrganiserDashboard from './pages/organiser/OrganiserDashboard';

// Import the ChatBot component
import ChatBot from './components/ChatBot/ChatBot';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<Navigate to="/" replace />} />

            {/* Admin Routes */}
            <Route path="/dashboard/home" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/users" element={<ProtectedRoute allowedRoles={['admin']}><UsersList /></ProtectedRoute>} />
            <Route path="/dashboard/events" element={<ProtectedRoute allowedRoles={['admin']}><EventsList /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute allowedRoles={['admin']}><Settings /></ProtectedRoute>} />

            {/* Customer Routes */}
            <Route path="/c/dashboard/home" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/c/dashboard/events" element={<ProtectedRoute allowedRoles={['customer']}><AllEvents /></ProtectedRoute>} />

            {/* Organiser Routes */}
            <Route path="/o/dashboard/home" element={<ProtectedRoute allowedRoles={['organiser']}><OrganiserDashboard /></ProtectedRoute>} />
          </Routes>
          
          {/* ChatBot component */}
          <ChatBot />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;