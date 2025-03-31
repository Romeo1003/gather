// components/EventDashboard/ErrorAlert.jsx
import { Alert } from '@mui/material';

const ErrorAlert = ({ error }) => {
	if (!error) return null;

	return (
		<Alert severity="error" sx={{ mb: 2 }}>
			{error}
		</Alert>
	);
};

export default ErrorAlert;