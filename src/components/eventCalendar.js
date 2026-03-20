import { Box } from 'grommet';
import React from 'react';

function EventCalendar({ date }) {
	// Convert timestamp string to number if needed
	const timestamp = typeof date === 'string' && /^\d+$/.test(date) ? parseInt(date, 10) : date;
	const dateObj = new Date(timestamp);
	const dateString = dateObj.toDateString();

	// Check if date is valid
	if (isNaN(dateObj.getTime())) {
		return (
			<Box className="eventCalendar" justify="center" align="center">
				<div>--</div>
				<div>--</div>
			</Box>
		);
	}

	return (
		<>
			<Box className="eventCalendar" justify="center" align="center">
				<div>{dateString.split(' ')[1].substring(0, 3)}</div>
				<div>{dateString.split(' ')[2]}</div>
			</Box>
		</>
	);
}

export default EventCalendar;
