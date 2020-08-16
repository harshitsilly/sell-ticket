import React from 'react';
import { Box } from 'grommet';
import './index.scss';

export default () => {
	return (
		<Box pad="medium" className="skeletonEvent">
			<div class="post">
				<div class="avatar"></div>
				<div class="line"></div>
				<div class="line"></div>
				<div class="ticket"></div>
			</div>
			<div class="post">
				<div class="avatar"></div>
				<div class="line"></div>
				<div class="line"></div>
			</div>
			<div class="post">
				<div class="avatar"></div>
				<div class="line"></div>
				<div class="line"></div>
			</div>
		</Box>
	);
};
