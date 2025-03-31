// components/EventDashboard/AnalyticsChart.jsx
import {
	Box,
	Typography,
	Card,
	FormControl,
	Select,
	MenuItem,
} from "@mui/material";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip as RechartsTooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

const AnalyticsChart = ({ cardStyle, timeRange, handleTimeRangeChange, chartData }) => {
	return (
		<Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 2,
				}}
			>
				<Typography variant="h6" component="h2" fontWeight="bold">
					Event Analytics
				</Typography>
				<FormControl size="small" sx={{ minWidth: 135 }}>
					<Select
						value={timeRange}
						onChange={handleTimeRangeChange}
						displayEmpty
						sx={{
							borderRadius: 8,
							"& .MuiOutlinedInput-notchedOutline": {
								borderColor: "rgba(0, 0, 0, 0.08)",
							},
						}}
					>
						<MenuItem value="7">Last 7 days</MenuItem>
						<MenuItem value="30">Last 30 days</MenuItem>
						<MenuItem value="90">Last 90 days</MenuItem>
					</Select>
				</FormControl>
			</Box>
			<Card
				sx={{
					...cardStyle,
					p: 2.5,
				}}
			>
				<Box sx={{ height: 350 }}>
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={chartData}
							margin={{
								top: 20,
								right: 30,
								left: 20,
								bottom: 10,
							}}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								vertical={false}
								stroke="rgba(0, 0, 0, 0.06)"
							/>
							<XAxis dataKey="name" />
							<YAxis />
							<RechartsTooltip
								contentStyle={{
									borderRadius: 12,
									boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
									border: "none",
								}}
							/>
							<Legend wrapperStyle={{ paddingTop: 20 }} />
							<Line
								type="monotone"
								dataKey="registrations"
								stroke="#1D9BF0"
								activeDot={{ r: 8 }}
								name="Registrations"
								strokeWidth={3}
								dot={{ strokeWidth: 2 }}
							/>
							<Line
								type="monotone"
								dataKey="revenue"
								stroke="#4CAF50"
								name="Revenue"
								strokeWidth={3}
								dot={{ strokeWidth: 2 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</Box>
			</Card>
		</Box>
	);
};

export default AnalyticsChart;