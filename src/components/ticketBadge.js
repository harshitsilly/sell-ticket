import { Box, Text } from 'grommet';
import { AddCircle } from 'grommet-icons';
import React from 'react';

function TicketBadge({type,ticketsAvailable}) {
	return (
		<>
		<Box align="center"  justify="center" className="ticketBadge">
    <Text className="ticketBadgeType">{type}</Text>
    <Text className="ticketBadgeTickets">{ticketsAvailable}</Text>
            </Box>	
		</>
	);
}

export default TicketBadge;
