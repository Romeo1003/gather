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

	// Handle session state and prevent back-button issues
	useEffect(() => {
		// Add a listener to intercept back button navigation when logged out
		const handlePopState = () => {
			if (!user) {
				// If user is not authenticated, prevent navigation to protected routes
				const protectedPaths = ['/dashboard', '/admin', '/profile'];
				const currentPath = window.location.pathname;
				
				if (protectedPaths.some(path => currentPath.startsWith(path))) {
					console.log('Intercepted back navigation to protected route while logged out');
					navigate('/signin', { replace: true });
				}
			}
		};

		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	}, [user, navigate]);

	useEffect(() => {
		let timer;
		if (user && requiresAdmin && user.role !== 'admin') {
			setShowUnauthorized(true);
			timer = setTimeout(() => {
				setShowUnauthorized(false);
				setIsRedirecting(true);
			}, 2000);
		}
		return () => clearTimeout(timer);
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
		console.log("User not authenticated, redirecting to signin");
		// Use replace to prevent going back to protected routes via browser back button
		return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
	}
	
	// For admin routes or routes that require admin, check if user has admin role
	if (requiresAdmin && user.role !== 'admin') {
		console.log(`Access denied for ${user.email} (${user.role}) to admin route`);
		
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
	if (!requiresAdmin && user.role === 'admin' && isRedirecting === false) {
		console.log("Admin user accessing regular route, redirecting to admin dashboard");
		return <Navigate to="/admin" replace />;
	}

	return children;
};

export default ProtectedRoute;