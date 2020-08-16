import React from 'react';
import { Box, Text, Grid } from 'grommet';
import { Ticket, FormDown } from 'grommet-icons';

import './index.scss';
function TicketGrpDetails(props) {
	return (
		<>
			<Box onClick={() => props.onClickTicketGrp(props.type)} justify="center" className="eventBox">
				<Grid className="ticketGrpGrid">
					<Box justify="center" className="ticketNameBox" align="start">
						<Text size="1rem">{props.type}</Text>
					</Box>

					<Box direction="row" justify="center">
						<div ticket-Data={props.count} className="eventTicket">
							<Ticket color="white" />
							<Text size="1rem">{props.count}</Text>
						</div>

						<FormDown />
					</Box>
				</Grid>
			</Box>
		</>
	);
}

export default TicketGrpDetails;
