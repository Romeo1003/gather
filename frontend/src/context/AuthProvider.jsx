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
			const protectedPaths = ['/dashboard', '/admin', '/profile'];
			
			// Check if current path is protected and user is not authenticated
			const isProtectedPath = protectedPaths.some(path => currentPath.startsWith(path));
			
			if (isProtectedPath && !user) {
				console.log('Protected route accessed without authentication, redirecting to signin');
				// Replace history state to prevent back button from returning to protected route
				navigate('/signin', { replace: true });
			}
		}
	}, [location.pathname, user, loading, navigate]);

	useEffect(() => {
		const verifyAuth = async () => {
			try {
				// Check for token in localStorage
				const token = localStorage.getItem('token');

				if (token) {
					// Verify with backend
					const response = await axios.get('http://localhost:5001/api/auth/verify', {
						headers: {
							Authorization: `Bearer ${token}`
						}
					});

					if (response.data.valid) {
						// Store user info with role
						const userInfo = { 
							token,
							email: response.data.user.email,
							role: response.data.user.role || 'customer' // Default to customer if role not provided
						};
						setUser(userInfo);
						
						// Auto-redirect to appropriate dashboard on page refresh/load
						const path = window.location.pathname;
						if (path === '/signin' || path === '/signup' || path === '/') {
							// Only redirect if user is on auth or home pages
							if (userInfo.role === 'admin') {
								navigate('/admin');
							} else {
								navigate('/dashboard/home');
							}
						} else if (userInfo.role === 'admin' && !path.startsWith('/admin')) {
							// If admin is on a non-admin page, redirect to admin dashboard
							navigate('/admin');
						} else if (userInfo.role !== 'admin' && path.startsWith('/admin')) {
							// If non-admin is on admin page, redirect to user dashboard
							navigate('/dashboard/home');
						}
					} else {
						clearAuth();
						// If token is invalid and user is on a protected route, redirect to login
						handleProtectedRouteRedirect();
					}
				} else {
					// No token, check if on protected route
					handleProtectedRouteRedirect();
				}
			} catch (error) {
				console.error("Auth verification failed:", error);
				clearAuth();
				// On error, also check if redirection needed
				handleProtectedRouteRedirect();
			} finally {
				setLoading(false);
			}
		};

		// Helper function to check if current path requires auth
		const handleProtectedRouteRedirect = () => {
			const currentPath = window.location.pathname;
			const protectedPaths = ['/dashboard', '/admin', '/profile'];
			
			if (protectedPaths.some(path => currentPath.startsWith(path))) {
				// Replace the history entry to prevent back navigation to protected routes
				navigate('/signin', { replace: true });
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
		clearAuth();
		// Use replace instead of push to prevent back button from returning to protected routes
		navigate('/signin', { replace: true });
		
		// Clear browser history state to prevent back navigation to authenticated routes
		if (window.history && window.history.pushState) {
			window.history.pushState(null, null, window.location.pathname);
			window.onpopstate = function() {
				window.history.pushState(null, null, '/signin');
			};
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

			// Clear authentication and redirect
			clearAuth();
			navigate('/signin', { replace: true });
			
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