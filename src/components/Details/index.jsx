import React from 'react';

import { Box } from 'grommet';
import Popover from '../commons/Popover';
import './index.scss';

const Details = () => {
	return (
		<>
			<Box className="appImageBox" direction="row" align="center" justify="between" pad="medium">
				<Popover>
					<img className="appImage" src="ticket.png" alt="" />
				</Popover>
				<Popover>
					<img className="appImage" src="shield_y_round.png" alt="" />
				</Popover>
				<Popover>
					<img className="appImage" src="heart_round.png" alt="" />
				</Popover>
				<Popover>
					<img className="appImage" src="money_round.png" alt="" />
				</Popover>
			</Box>
		</>
	);
};

export default Details;
