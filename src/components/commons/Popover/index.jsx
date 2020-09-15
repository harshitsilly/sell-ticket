import React, { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { Box } from 'grommet';
import Popup from '../Popup';
import './index.scss';

const Popover = ({ className, bgColor, children, contentText, caret }) => {
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
				caret={caret}
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
	caret: true,
	className: '',
	bgColor: '#3399FF',
	contentText: ''
};

Popover.propTypes = {
	caret: PropTypes.bool,
	children: PropTypes.element,
	className: PropTypes.string,
	bgColor: PropTypes.string,
	contentText: PropTypes.string
};

export default Popover;
