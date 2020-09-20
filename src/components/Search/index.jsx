import React from 'react';
import { Search } from 'grommet-icons';
import { TextInput } from 'grommet';
import Popover from '../commons/Popover';
import './index.scss';

const Details = () => {
	return (
		<>
			<Popover
				caret={false}
				color="#000"
				bgColor="#fff"
				content={<div>The most transparent, consumer friendly ticket marketplace on the web.</div>}
			>
				<Search className="appSearchIcon" />
				<TextInput className="appSearch" placeholder="Search by events,venues and cities" />
			</Popover>
		</>
	);
};

export default Details;
