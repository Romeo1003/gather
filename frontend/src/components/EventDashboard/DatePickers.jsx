// components/EventDashboard/DatePickers.jsx
import { Grid } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';

const DatePickers = ({
	event,
	onChange,
	fieldErrors
}) => {
	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={6}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DateTimePicker
						label="Start Date & Time *"
						value={event.startDate || null}
						onChange={(value) => onChange('startDate', value)}
						renderInput={(params) => (
							<TextField
								{...params}
								fullWidth
								error={fieldErrors.startDate}
								helperText={fieldErrors.startDate ? 'This field is required' : ''}
							/>
						)}
					/>
				</LocalizationProvider>
			</Grid>
			<Grid item xs={12} md={6}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DateTimePicker
						label="End Date & Time *"
						value={event.endDate || null}
						onChange={(value) => onChange('endDate', value)}
						renderInput={(params) => (
							<TextField
								{...params}
								fullWidth
								error={fieldErrors.endDate}
								helperText={fieldErrors.endDate ? 'This field is required' : ''}
							/>
						)}
						minDateTime={event.startDate || null}
					/>
				</LocalizationProvider>
			</Grid>
		</Grid>
	);
};

export default DatePickers;