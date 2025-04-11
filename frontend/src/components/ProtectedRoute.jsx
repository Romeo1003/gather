import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';

const ProtectedRoute = ({ children, adminRequired = false }) => {
	const { user, loading } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();
	const isAdminRoute = location.pathname.startsWith('/admin');
	
	// If any route requires admin explicitly or is under /admin path
	const requiresAdmin = adminRequired || isAdminRoute;

	// State for showing unauthorized message before redirecting
	const [showUnauthorized, setShowUnauthorized] = useState(false);
	// Add a state for tracking if we're redirecting from an unauthorized attempt
	const [isRedirecting, setIsRedirecting] = useState(false);

	// This effect is problematic and can cause issues with admin access
	// Let's simplify it to avoid interference with legitimate navigation
	useEffect(() => {
		// Only run the effect if we have a user and they're trying to access admin content
		if (user && requiresAdmin && user.role !== 'admin') {
			// Show unauthorized message briefly before redirecting
			setShowUnauthorized(true);
			const timer = setTimeout(() => {
				setShowUnauthorized(false);
				setIsRedirecting(true);
			}, 2000);
			
			return () => clearTimeout(timer);
		}
	}, [user, requiresAdmin]);

	// If still loading, show loading indicator
	if (loading) {
		return (
			<Box sx={{ 
				display: 'flex', 
				flexDirection: 'column',
				justifyContent: 'center', 
				alignItems: 'center', 
				height: '100vh' 
			}}>
				<CircularProgress />
				<Typography variant="body1" sx={{ mt: 2 }}>
					Verifying authentication...
				</Typography>
			</Box>
		);
	}

	// If user is not logged in, redirect to login
	if (!user) {
		console.log("ProtectedRoute: User not authenticated, redirecting to signin");
		// Use replace to prevent going back to protected routes via browser back button
		return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
	}
	
	// For admin routes or routes that require admin, check if user has admin role
	if (requiresAdmin && user.role !== 'admin') {
		console.log(`ProtectedRoute: Access denied for ${user.email} (${user.role}) to admin route`);
		
		if (showUnauthorized) {
			return (
				<Box sx={{ 
					display: 'flex', 
					flexDirection: 'column',
					justifyContent: 'center', 
					alignItems: 'center', 
					height: '100vh',
					p: 2
				}}>
					<Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 500 }}>
						Access Denied: Administrator privileges required
					</Alert>
					<Typography>
						Redirecting to dashboard...
					</Typography>
				</Box>
			);
		}
		
		// Redirect non-admin users to the appropriate dashboard
		return <Navigate to="/dashboard/home" state={{ unauthorized: true }} replace />;
	}

	// Make sure regular users don't access admin routes
	// But this check should be conditional on whether we're already redirecting
	if (!requiresAdmin && user.role === 'admin' && !isRedirecting) {
		console.log("ProtectedRoute: Admin user accessing regular route, redirecting to admin dashboard");
		return <Navigate to="/admin" replace />;
	}

	// Render the protected content
	console.log(`ProtectedRoute: Access granted for ${user.email} (${user.role})`);
	return children;
};

export default ProtectedRoute;