import { Box, Text, Grid } from 'grommet';
import { Ticket } from 'grommet-icons';
import React from 'react';

function TicketDetails(props) {
	return (
		<>
			<Box onClick={() => (props.onClickTicket ? props.onClickTicket(props) : undefined)} justify="center" className="eventBox">
				<Grid className="ticketGrid">
					<Box justify="center" className="ticketNameBox" align="start">
						<Text size="1rem">{props.passType}</Text>
						<Text size=".90rem">
							{props.user.firstName} {props.user.lastName}
						</Text>
					</Box>
					<Text className="ticketCost" size="1rem">
						<img src="rupee.svg" alt=""></img>
						{props.cost}
					</Text>
					<div ticket-Data={props.numberOfTickets} ticket-Color={props.ticketColor} className="eventTicket">
						<Ticket color="white" />
						<Text size="1rem">{props.numberOfTickets}</Text>
					</div>
				</Grid>
			</Box>
		</>
	);
}

export default TicketDetails;
