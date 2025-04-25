import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './authContext';

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const location = useLocation();

	// Add an effect to handle protected routes when user is not authenticated
	useEffect(() => {
		// Skip on initial load as verifyAuth will handle redirects
		if (!loading) {
			const currentPath = location.pathname;
			const protectedPaths = ['/dashboard', '/admin', '/profile', '/custdashboard'];
			
			// Check if current path is protected and user is not authenticated
			const isProtectedPath = protectedPaths.some(path => currentPath.startsWith(path));
			
			if (isProtectedPath && !user) {
				console.log('Protected route accessed without authentication, redirecting to signin');
				// Check if it's an admin path and redirect to admin-signin instead
				if (currentPath.startsWith('/admin')) {
					navigate('/admin-signin', { replace: true });
				} else {
					navigate('/signin', { replace: true });
				}
			}
		}
	}, [location.pathname, user, loading, navigate]);

	useEffect(() => {
		const verifyAuth = async () => {
			try {
				const token = localStorage.getItem('token');
				const sessionToken = sessionStorage.getItem('token'); // Check both storage locations
				const activeToken = token || sessionToken;

				if (!activeToken) {
					console.log("No authentication token found");
					handleProtectedRouteRedirect();
					return;
				}

				// Set up axios with timeout and retry logic
				const response = await axios.get('http://localhost:5001/api/auth/verify', {
					headers: { Authorization: `Bearer ${activeToken}` },
					timeout: 5000, // 5 second timeout
					retry: 2, // Retry failed requests twice
					retryDelay: 1000 // Wait 1 second between retries
				});

				if (!response.data?.valid || !response.data?.user) {
					throw new Error("Invalid or missing user data in response");
				}

				// Enhanced user info with additional security checks
				const userInfo = {
					token: activeToken,
					email: response.data.user.email,
					role: response.data.user.role || 'customer',
					id: response.data.user.id, // Store user ID for API calls
					lastVerified: Date.now() // Track last verification time
				};

				console.log("Auth verification successful");
				setUser(userInfo);

				// Handle navigation based on current path and user role
				const path = window.location.pathname;
				const isAuthPage = [
					'/signin', '/signup', '/',
					'/admin-signin', '/admin-signup'
				].includes(path);

				if (isAuthPage) {
					// Redirect from auth pages to appropriate dashboard
					navigate(userInfo.role === 'admin' ? '/admin' : '/dashboard/home');
				} else if (userInfo.role === 'admin' && !path.startsWith('/admin') && path !== '/profile') {
					// Redirect admin to admin dashboard if on non-admin pages
					navigate('/admin');
				} else if (userInfo.role !== 'admin' && path.startsWith('/admin')) {
					// Redirect non-admin users away from admin pages
					navigate('/dashboard/home');
				}
			} catch (error) {
				console.error("Auth verification failed:", error.message);
				clearAuth();
				handleProtectedRouteRedirect();
			} finally {
				setLoading(false);
			}
		};

		// Helper function to check if current path requires auth
		const handleProtectedRouteRedirect = () => {
			const currentPath = window.location.pathname;
			const protectedPaths = ['/dashboard', '/admin', '/profile', '/custdashboard'];
			
			if (protectedPaths.some(path => currentPath.startsWith(path))) {
				// Replace the history entry to prevent back navigation to protected routes
				console.log("Redirecting from protected route to signin");
				// Direct admin routes to admin login
				if (currentPath.startsWith('/admin')) {
					navigate('/admin-signin', { replace: true });
				} else {
					navigate('/signin', { replace: true });
				}
			}
		};

		verifyAuth();
	}, [navigate]);

	const clearAuth = () => {
		localStorage.removeItem('token');
		setUser(null);
	};

	const login = (token, userData = {}) => {
		localStorage.setItem('token', token);
		
		// Get user role from userData or default to customer
		const userInfo = {
			token,
			email: userData.email,
			role: userData.role || 'customer'
		};
		
		console.log(`Setting user with role: ${userInfo.role}`);
		setUser(userInfo);
		
		// Redirect based on role
		if (userInfo.role === 'admin') {
			console.log('Redirecting to admin dashboard');
			navigate('/admin');
		} else {
			console.log('Redirecting to user dashboard');
			navigate('/dashboard/home');
		}
	};

	const logout = async () => {
		try {
			await axios.post('http://localhost:5001/api/auth/logout');
		} catch (error) {
			console.error("Logout error:", error);
		}
		
		// Save the current path to determine which login page to navigate to after logout
		const currentPath = location.pathname;
		const isAdminPath = currentPath.startsWith('/admin');
		
		// Important: Clear auth before navigation
		clearAuth();
		
		// Navigate to the appropriate login page
		if (isAdminPath) {
			navigate('/admin-signin', { replace: true });
		} else {
			navigate('/signin', { replace: true });
		}
		
		// Modified history manipulation to be less aggressive
		if (window.history && window.history.pushState) {
			// Only set a single pushState to clean the history
			window.history.pushState(null, '', isAdminPath ? '/admin-signin' : '/signin');
			
			// Remove any existing onpopstate handler
			window.onpopstate = null;
		}
	};

	// Delete account
	const deleteAccount = async (password) => {
		try {
			if (!user || !user.token) {
				throw new Error("You must be logged in to delete your account");
			}

			// Call API to delete the account
			await axios.delete('http://localhost:5001/api/auth/delete-account', {
				headers: {
					Authorization: `Bearer ${user.token}`
				},
				data: { password }
			});

			// Determine if the user is an admin
			const isAdmin = user.role === 'admin';
			
			// Clear authentication and redirect
			clearAuth();
			navigate(isAdmin ? '/admin-signin' : '/signin', { replace: true });
			
			return { success: true, message: "Account deleted successfully" };
		} catch (error) {
			console.error("Delete account error:", error);
			return { 
				success: false, 
				message: error.response?.data?.message || "Failed to delete account"
			};
		}
	};

	const value = {
		user,
		loading,
		login,
		logout,
		deleteAccount,
		isAdmin: user?.role === 'admin'
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading ? children : <div>Loading authentication...</div>}
		</AuthContext.Provider>
	);
};

export default AuthProvider;