// // components/EventDashboard/SummaryCards.jsx
// import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
// import {
// 	EventNote as EventNoteIcon,
// 	Person as PersonIcon,
// 	ConfirmationNumber as TicketIcon,
// 	AttachMoney as MoneyIcon,
// } from "@mui/icons-material";

// const SummaryCards = ({ cardStyle }) => {
// 	const cards = [
// 		{
// 			title: "Total Events",
// 			value: "48",
// 			icon: <EventNoteIcon color="primary" />,
// 		},
// 		{
// 			title: "Total Attendees",
// 			value: "2,847",
// 			icon: <PersonIcon color="primary" />,
// 		},
// 		{
// 			title: "Tickets Sold",
// 			value: "3,621",
// 			icon: <TicketIcon color="primary" />,
// 		},
// 		{
// 			title: "Revenue",
// 			value: "$124,200",
// 			icon: <MoneyIcon color="primary" />,
// 		},
// 	];

// 	return (
// 		<Grid container spacing={2} sx={{ mb: 4 }}>
// 			{cards.map((card, index) => (
// 				<Grid item xs={12} sm={6} lg={3} key={index}>
// 					<Card sx={{ height: '100%', ...cardStyle }}>
// 						<CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
// 							<Box
// 								sx={{
// 									display: "flex",
// 									justifyContent: "space-between",
// 									alignItems: "center",
// 								}}
// 							>
// 								<Box>
// 									<Typography
// 										color="textSecondary"
// 										variant="body2"
// 										sx={{ fontSize: { xs: '0.875rem', sm: 'inherit' } }}
// 									>
// 										{card.title}
// 									</Typography>
// 									<Typography
// 										variant="h4"
// 										component="div"
// 										fontWeight="bold"
// 										sx={{
// 											mt: 0.5,
// 											fontSize: {
// 												xs: '1.5rem',
// 												sm: '1.75rem',
// 												md: '2.125rem'
// 											}
// 										}}
// 									>
// 										{card.value}
// 									</Typography>
// 								</Box>
// 								<Box
// 									sx={{
// 										bgcolor: "rgba(25, 118, 210, 0.1)",
// 										borderRadius: "50%",
// 										width: { xs: 40, sm: 48 },
// 										height: { xs: 40, sm: 48 },
// 										display: "flex",
// 										alignItems: "center",
// 										justifyContent: "center",
// 										flexShrink: 0,
// 										ml: 1
// 									}}
// 								>
// 									{card.icon}
// 								</Box>
// 							</Box>
// 						</CardContent>
// 					</Card>
// 				</Grid>
// 			))}
// 		</Grid>
// 	);
// };

// export default SummaryCards;



import React from 'react';
import { motion } from 'framer-motion';
import {
	EventNote as EventNoteIcon,
	Person as PersonIcon,
	ConfirmationNumber as TicketIcon,
	AttachMoney as MoneyIcon
} from "@mui/icons-material";
import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils.js";

// Gradient backgrounds for cards
const CARD_BACKGROUNDS = [
	"bg-gradient-to-br from-blue-50 to-blue-100",
	"bg-gradient-to-br from-green-50 to-green-100",
	"bg-gradient-to-br from-orange-50 to-orange-100",
	"bg-gradient-to-br from-red-50 to-red-100"
];

// Card configuration
const cards = [
	{
		title: "Total Events",
		value: "48",
		icon: <EventNoteIcon className="text-blue-600 w-8 h-8" />,
		backgroundClass: CARD_BACKGROUNDS[0],
		iconBgClass: "bg-blue-100/50"
	},
	{
		title: "Total Attendees",
		value: "2,847",
		icon: <PersonIcon className="text-green-600 w-8 h-8" />,
		backgroundClass: CARD_BACKGROUNDS[1],
		iconBgClass: "bg-green-100/50"
	},
	{
		title: "Tickets Sold",
		value: "3,621",
		icon: <TicketIcon className="text-orange-600 w-8 h-8" />,
		backgroundClass: CARD_BACKGROUNDS[2],
		iconBgClass: "bg-orange-100/50"
	},
	{
		title: "Revenue",
		value: "$124,200",
		icon: <MoneyIcon className="text-red-600 w-8 h-8" />,
		backgroundClass: CARD_BACKGROUNDS[3],
		iconBgClass: "bg-red-100/50"
	}
];

const SummaryCards = () => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
			{cards.map((card, index) => (
				<motion.div
					key={card.title}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						delay: index * 0.2,
						duration: 0.5
					}}
					className="w-full"
				>
					<Card
						className={cn(
							"w-full h-full overflow-hidden transition-all duration-300 ease-in-out",
							"hover:shadow-xl hover:scale-[1.02]",
							card.backgroundClass,
							"border-none"
						)}
					>
						<CardContent className="p-6">
							<div className="flex justify-between items-center">
								<div className="space-y-2">
									<p className="text-sm font-medium text-gray-600 tracking-wide uppercase">
										{card.title}
									</p>
									<div className="text-3xl font-bold text-gray-800 tracking-tight">
										{card.value}
									</div>
								</div>
								<div
									className={cn(
										"p-3 rounded-full flex items-center justify-center",
										"transform transition-all duration-300 ease-in-out",
										"group-hover:rotate-12",
										card.iconBgClass
									)}
								>
									{card.icon}
								</div>
							</div>
							<div
								className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 rounded-full"
								style={{
									background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)'
								}}
							/>
						</CardContent>
					</Card>
				</motion.div>
			))}
		</div>
	);
};

export default SummaryCards;