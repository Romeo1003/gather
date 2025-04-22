// components/EventDashboard/DialogHeader.jsx
import { Box, IconButton, DialogTitle } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const DialogHeader = ({ title, onClose, isLoading }) => {
	return (
		<DialogTitle>
			<Box display="flex" justifyContent="space-between" alignItems="center">
				{title}
				<IconButton onClick={onClose} disabled={isLoading}>
					<CloseIcon />
				</IconButton>
			</Box>
		</DialogTitle>
	);
};

export default DialogHeader;