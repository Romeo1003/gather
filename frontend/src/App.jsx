import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ForgotPasswordPage from "./components/ForgotPass";
import ResetPasswordPage from "./components/ResetPass";
import { ThemeProvider, CssBaseline } from "@mui/material";
import SignupPage from "./components/SignupPage";
import SignInPage from "./components/SignInPage";
import EventDashboard from "./components/EventDashboard/EventDashboard";
import CustomerDashboard from "./components/EventDashboard/CustomerDashboard";
// import EventManagement from "./components/EventDashboard/EventManagement";
import AllEvents from "./components/EventDashboard/Events";
import BookingsTickets from "./components/EventDashboard/MyBookingsTickets";
import LandingPage from "./components/landing";
import ProfileSettings from "./components/ProfileSettings";
import theme from "./theme";
import AuthProvider from './context/AuthProvider';
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<SignInPage />} />
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
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;