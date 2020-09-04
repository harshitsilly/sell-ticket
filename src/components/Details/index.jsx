import React from 'react';

import { Box } from 'grommet';
import Popover from '../commons/Popover';
import './index.scss';

const Details = () => {
	return (
		<>
			<Box className="appImageBox" direction="row" align="center" width="100%" justify="between">
				<Popover contentText="The most transparent, consumer friendly ticket marketplace on the web.">
					<img className="appImage" src="ticket.png" alt="" />
				</Popover>
				<Popover contentText="Authentic, valid tickets backed by our 100% money back guarantee." bgColor="#FFD200">
					<img className="appImage" src="shield_y_round.png" alt="" />
				</Popover>
				<Popover contentText="You'll love your ticketing experience, from purchase through the final whistle." bgColor="#FF227A">
					<img className="appImage" src="heart_round.png" alt="" />
				</Popover>
				<Popover contentText="No hidden fees. Save an average of 10-15% on every purchase guaranteed." bgColor="#00E054">
					<img className="appImage" src="money_round.png" alt="" />
				</Popover>
			</Box>
		</>
	);
};

export default Details;
