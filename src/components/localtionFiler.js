import React, { useLayoutEffect } from 'react';
import { Box, DropButton, TextInput } from 'grommet';
import { Location, CaretDown, Search } from 'grommet-icons';
import LocationContent from './locationContent';

function LocaltionFiler({ setLocationCallback }) {
	const dropref = React.useRef(null);
	const locationRef = React.useRef();
	const [location, setLocation] = React.useState('nearby');
	const [dropContentState, setDropContentState] = React.useState(false);
	const [value, setValue] = React.useState('');
	const setLocationAndClose = location => {
		dropref.current.click();
		setLocation(location);
		setLocationCallback(location);
	};
	let setTextInputFocus = () => {
		dropContentState && locationRef.current.focus();
	};
	return (
		<>
			<Box direction="row" pad="none" className="filterBoxBorder">
				<DropButton
					ref={dropref}
					onClose={() => setDropContentState(false)}
					onOpen={() => {
						setDropContentState(true);
					}}
					className="filterButton"
					icon={
						!dropContentState && (
							<Box width="2.5rem" pad="small" round="medium" background="brand">
								<Location />
							</Box>
						)
					}
					label={
						(!dropContentState && (
							<Box direction="row" align="center" width="100%" justify="between" pad="none">
								<Box direction="column" className="filterHeader">
									Location<Box className="filterSubHeader">{location}</Box>
								</Box>
								<Box>
									<CaretDown size="15px" className="caretDown" />
								</Box>
							</Box>
						)) ||
						(dropContentState && (
							<Box height="60px" direction="row" align="center" justify="center" pad="none">
								<Search className="locationSearchIcon" />
								<TextInput
									ref={locationRef}
									className="locationSearch"
									placeholder="Search your city"
									value={value}
									onChange={event => setValue(event.target.value)}
								/>
							</Box>
						))
					}
					dropAlign={{ top: 'bottom', right: 'right' }}
					dropContent={
						dropContentState && (
							<LocationContent
								setTextInputFocus={setTextInputFocus}
								value={value}
								setLocationAndClose={setLocationAndClose}
							/>
						)
					}
				/>
			</Box>
		</>
	);
}

export default LocaltionFiler;
