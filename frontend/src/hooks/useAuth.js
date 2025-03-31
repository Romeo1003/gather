import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

const useAuth = () => {
	return useContext(AuthContext);
};

export default useAuth;


// import { useContext } from 'react';
// import AuthContext from '../context/authContext';

// const useAuth = () => {
// 	const context = useContext(AuthContext);
// 	if (!context) {
// 		throw new Error('useAuth must be used within an AuthProvider');
// 	}
// 	return context;
// };

// export default useAuth;