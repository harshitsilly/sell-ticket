import React from 'react';

import { TextInput } from 'grommet';
import Popover from '../commons/Popover';
import './index.scss';

const Details = () => {
	return (
		<>
			<Popover
				caret={false}
				bgColor="#fff"
				contentText={<div>The most transparent, consumer friendly ticket marketplace on the web.</div>}
			>
				{/* <Search className="appSearchIcon" /> */}
				<TextInput className="appSearch" placeholder="Search by events,venues and cities" />
			</Popover>
		</>
	);
};

export default Details;
