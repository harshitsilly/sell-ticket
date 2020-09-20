import React from 'react';
import PropTypes from 'prop-types';
import { Box, Drop } from 'grommet';
import { CaretDown } from 'grommet-icons';
import './index.scss';

const Popover = ({ className, target, show, content, bgColor, onClickOutside, caret, color }) => {
	if (target) {
		const { x, width, y, height } = target.getBoundingClientRect();
		return (
			<>
				{show && (
					<>
						{caret && (
							<CaretDown
								style={{ left: x + width / 4, top: y + height - 10 }}
								className="popoverCaret"
								color={bgColor}
							></CaretDown>
						)}
						<Drop
							elevation="medium"
							align={{ top: 'bottom' }}
							onClickOutside={event => onClickOutside(event)}
							style={{ backgroundColor: bgColor, minWidth: width }}
							className={`popover ${className}`}
							target={target}
						>
							<Box style={{ color: color }} className="text">
								{content}
							</Box>
						</Drop>
					</>
				)}
			</>
		);
	} else {
		return <></>;
	}
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
