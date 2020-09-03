import React from 'react';
import PropTypes from 'prop-types';
import { Box, Drop } from 'grommet';
import './index.scss';

const Popover = ({ className, target, show, contentText, bgColor, onClickOutside }) => {
	return (
		<>
			{show && (
				<Drop
					align={{ top: 'bottom', right: 'right' }}
					onClickOutside={event => onClickOutside(event)}
					style={{ backgroundColor: bgColor }}
					className={`popover ${className}`}
					target={target}
				>
					<Box className="text" pad="small">
						{contentText}
					</Box>
				</Drop>
			)}
		</>
	);
};

Popover.defaultProps = {
	target: null,
	show: false,
	bgColor: '#3399FF',
	contentText: 'testing data'
};

Popover.propTypes = {
	target: PropTypes.object,
	show: PropTypes.bool,
	bgColor: PropTypes.string,
	contentText: PropTypes.string
};

export default Popover;
