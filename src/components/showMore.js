import { Box, Text } from 'grommet';
import { AddCircle } from 'grommet-icons';
import React from 'react';

function ShowMore({ name,onClick }) {
	return (
		<>
			<Box onClick={onClick} className="showMore" direction="row" align="center">
				<Box width="60px" justify="center" align="center">
					<AddCircle className="showMoreIcon" />
				</Box>
				<Box className="showMoreText">
					<Text>Show more</Text>
					<Text>{`Events at ${name}`}</Text>
				</Box>
			</Box>
		</>
	);
}

export default ShowMore;
