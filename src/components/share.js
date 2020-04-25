import React from 'react';
import { Button } from 'grommet';
import { ShareOption } from 'grommet-icons';

export default () => {
	let onClickShare = () => {
		navigator
			.share({
				title: 'Sell Ticket',
				text: 'Check out this event',
				url: window.location.href
			})
			.then(() => console.log('Successful share'))
			.catch(error => console.log('Error sharing', error));
	};
	if (navigator.share) {
		return <Button onClick={onClickShare} plain icon={<ShareOption color="status-ok" />}></Button>;
	}
	return <></>;
};
