import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import ForgotPasswordPage from "./components/ForgotPass";
import ResetPasswordPage from "./components/ResetPass";
import { ThemeProvider, CssBaseline } from "@mui/material";
import SignupPage from "./components/SignupPage";
import SignInPage from "./components/SignInPage";
// import AdminSignupPage from "./components/AdminSignupPage"; // No longer needed
import EventDashboard from "./components/EventDashboard/EventDashboard";
import CustomerDashboard from "./components/EventDashboard/CustomerDashboard";
// import EventManagement from "./components/EventDashboard/EventManagement";
import AllEvents from "./components/EventDashboard/Events";
import BookingsTickets from "./components/EventDashboard/MyBookingsTickets";
import LandingPage from "./components/landing";
import ProfileSettings from "./components/ProfileSettings";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import Chatbot from "./components/Chatbot/Chatbot";
import CreateEventPage from "./pages/CreateEventPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import theme from "./theme";
import AuthProvider from './context/AuthProvider';
import ProtectedRoute from "./components/ProtectedRoute";
import { createBrowserHistory } from "history";

// Create a history object that will be used to manage browser history
const history = createBrowserHistory();

// HistoryBlocker component to prevent access to protected routes after logout
const HistoryBlocker = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Get auth state
    const isAuthenticated = localStorage.getItem('token') !== null;
    const currentPath = location.pathname;
    const protectedPaths = ['/dashboard', '/admin', '/profile', '/custdashboard'];
    
    // Check if attempting to access protected path without authentication
    if (!isAuthenticated && protectedPaths.some(path => currentPath.startsWith(path))) {
      console.log('Blocked navigation to protected route while logged out');
      navigate('/signin', { replace: true });
    }
    
    // Handle browser back button
    const handleBeforeUnload = () => {
      // If user is not authenticated and trying to access protected route
      if (!isAuthenticated && protectedPaths.some(path => currentPath.startsWith(path))) {
        navigate('/signin', { replace: true });
      }
    };
    
    window.addEventListener('popstate', handleBeforeUnload);
    return () => window.removeEventListener('popstate', handleBeforeUnload);
  }, [location, navigate]);
  
  return null;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <HistoryBlocker />
          <Routes>
            <Route path="/signup" element={<SignupPage userType="customer" />} />
            <Route path="/admin-signup" element={<SignupPage userType="admin" />} />
            <Route path="/signin" element={<SignInPage userType="customer" />} />
            <Route path="/admin-signin" element={<SignInPage userType="admin" />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/" element={<LandingPage />} />

            {/* Protected routes */}
            <Route path="/dashboard/home" element={
              <ProtectedRoute>
                <EventDashboard />
              </ProtectedRoute>
            } />
            <Route path="/custdashboard/home" element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/custdashboard/events" element={
              <ProtectedRoute>
                <AllEvents />
              </ProtectedRoute>
            } />
            {/* <Route path="/dashboard/edit-event" element={
              <ProtectedRoute>
                <EventManagement />
              </ProtectedRoute>
            } /> */}
            <Route path="/dashboard/bookings" element={
              <ProtectedRoute>
                <BookingsTickets />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/create-event" element={
              <ProtectedRoute>
                <CreateEventPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            } />
            
            {/* Admin Dashboard */}
            <Route path="/admin/*" element={
              <ProtectedRoute adminRequired={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/dashboard/event/:eventId" element={
              <ProtectedRoute>
                <EventDetailsPage />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
          
          {/* Chatbot is available on all pages */}
          <Chatbot />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;