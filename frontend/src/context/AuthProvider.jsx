// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from './authContext';

// const AuthProvider = ({ children }) => {
// 	const [user, setUser] = useState(null);
// 	const navigate = useNavigate();

// 	useEffect(() => {
// 		const token = localStorage.getItem('token');
// 		if (token) {
// 			setUser({ token });
// 		}
// 	}, []);

// 	const login = (token) => {
// 		localStorage.setItem('token', token);
// 		setUser({ token });
// 		navigate('/dashboard/home');
// 	};

// 	const logout = () => {
// 		localStorage.removeItem('token');
// 		setUser(null);
// 		navigate('/signin');
// 	};

// 	return (
// 		<AuthContext.Provider value={{ user, login, logout }}>
// 			{children}
// 		</AuthContext.Provider>
// 	);
// };

// export default AuthProvider;



import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './authContext';

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const verifyAuth = async () => {
			try {
				// Check for token in localStorage
				const token = localStorage.getItem('token');

				if (token) {
					// Verify with backend
					const response = await axios.get('http://localhost:5000/api/auth/verify', {
						headers: {
							Authorization: `Bearer ${token}`
						}
					});

					if (response.data.valid) {
						setUser({ token });
					} else {
						clearAuth();
					}
				}
			} catch (error) {
				console.error("Auth verification failed:", error);
				clearAuth();
			} finally {
				setLoading(false);
			}
		};

		verifyAuth();
	}, []);

	const clearAuth = () => {
		localStorage.removeItem('token');
		setUser(null);
	};

	const login = (token) => {
		localStorage.setItem('token', token);
		setUser({ token });
		navigate('/dashboard/home');
	};

	const logout = async () => {
		try {
			await axios.post('http://localhost:5000/api/auth/logout');
		} catch (error) {
			console.error("Logout error:", error);
		}
		clearAuth();
		navigate('/signin');
	};

	return (
		<AuthContext.Provider value={{ user, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;