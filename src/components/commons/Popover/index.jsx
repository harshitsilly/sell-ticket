import React, { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { Box } from 'grommet';
import Popup from '../Popup';
import './index.scss';

const Popover = ({ className, bgColor, children, contentText }) => {
	const [show, setShow] = React.useState(false);

	const boxRef = React.useRef();
	const onClickOutside = event => {
		if (boxRef.current !== event.target) {
			setShow(!show);
		}
	};

	return (
		<>
			<div
				ref={boxRef}
				className="popoverTarget"
				onClick={() => {
					setShow(!show);
				}}
			>
				{children}
			</div>

			<Popup
				contentText={contentText}
				className={className}
				target={boxRef.current}
				show={show}
				bgColor={bgColor}
				onClickOutside={onClickOutside}
			></Popup>
		</>
	);
};

Popover.defaultProps = {
	className: '',
	bgColor: '#3399FF',
	contentText: ''
};

Popover.propTypes = {
	children: PropTypes.element,
	className: PropTypes.string,
	bgColor: PropTypes.string,
	contentText: PropTypes.string
};

export default Popover;
