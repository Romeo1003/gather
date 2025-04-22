// components/EventDashboard/EventFormFields.jsx
import {
	Grid,
	TextField,
	Typography,
	Box,
	IconButton,
} from "@mui/material";
import { LocationOn as LocationIcon } from "@mui/icons-material";

const EventFormFields = ({
	event,
	onChange,
	fieldErrors,
}) => {
	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<TextField
					label="Event Title *"
					placeholder="Enter event title"
					fullWidth
					value={event.title || ''}
					onChange={(e) => onChange('title', e.target.value)}
					error={fieldErrors.title}
					helperText={fieldErrors.title ? 'This field is required' : ''}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					label="Event Description *"
					placeholder="Describe your event"
					fullWidth
					multiline
					rows={4}
					value={event.description || ''}
					onChange={(e) => onChange('description', e.target.value)}
					error={fieldErrors.description}
					helperText={fieldErrors.description ? 'This field is required' : ''}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					label="Venue Location *"
					placeholder="Enter venue address"
					fullWidth
					value={event.location || ''}
					onChange={(e) => onChange('location', e.target.value)}
					error={fieldErrors.location}
					helperText={fieldErrors.location ? 'This field is required' : ''}
					InputProps={{
						endAdornment: (
							<IconButton>
								<LocationIcon />
							</IconButton>
						),
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					label="Price ($)"
					type="number"
					placeholder="0.00"
					fullWidth
					value={event.price || ''}
					onChange={(e) => onChange('price', e.target.value)}
					InputProps={{
						inputProps: { min: 0, step: 0.01 }
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					label="Time Display"
					placeholder="e.g. 14:00 - 18:00"
					fullWidth
					value={event.time || ''}
					onChange={(e) => onChange('time', e.target.value)}
					helperText="This will be displayed to users (optional)"
				/>
			</Grid>
		</Grid>
	);
};

export default EventFormFields;