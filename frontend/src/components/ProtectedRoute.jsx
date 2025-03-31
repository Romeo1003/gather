import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
	const { user, loading } = useAuth();

	if (loading) {
		return <div>Loading authentication...</div>;
	}

	return user ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;