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
    // This effect should only block navigation to protected routes when not authenticated
    // It should not interfere with normal authenticated navigation
    
    // Get auth state - only check localStorage, not from context to avoid circular dependencies
    const isAuthenticated = localStorage.getItem('token') !== null;
    
    // If authenticated, don't block anything
    if (isAuthenticated) {
      return;
    }
    
    const currentPath = location.pathname;
    const protectedPaths = ['/dashboard', '/admin', '/profile', '/custdashboard'];
    
    // Only redirect if not authenticated and trying to access protected route
    const isProtectedPath = protectedPaths.some(path => currentPath.startsWith(path));
    
    if (!isAuthenticated && isProtectedPath) {
      console.log('HistoryBlocker: Blocked navigation to protected route while logged out');
      navigate('/signin', { replace: true });
    }
    
    // Simplified popstate handler that only checks current state
    const handlePopState = () => {
      const isAuthenticatedNow = localStorage.getItem('token') !== null;
      const currentPathNow = window.location.pathname;
      const isProtectedPathNow = protectedPaths.some(path => currentPathNow.startsWith(path));
      
      if (!isAuthenticatedNow && isProtectedPathNow) {
        console.log('HistoryBlocker: Intercepted back navigation to protected route');
        navigate('/signin', { replace: true });
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [location.pathname, navigate]);
  
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