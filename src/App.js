import React, { createContext } from 'react';

import { Box, Button, Footer, TextInput, Text, Video } from 'grommet';
import { Down, Search, Attraction, Music, PlayFill, Trophy, Multimedia } from 'grommet-icons';

import AppHeader from './components/appHeader';
import EventFIlter from './pages/EventFilter';
import IconDetails from './components/Details';
import AppSearch from './components/Search';
import { Redirect } from 'react-router-dom';
import constants from './constants';
import './css/app.scss';

function App() {
	const [value, setValue] = React.useState('');
	const [redirect, setRedirect] = React.useState('');
	const moveToAppContent = () => {
		let appContentTop = appContent.current.offsetTop;
		window.scrollTo({ top: appContentTop });
	};

	const appContent = React.useRef();
	if (redirect) return <Redirect push="true" to={`/${redirect}`} />;

	return (
		<>
			<Box>
				<Box className="appFirstPageBackgroundImage">
					<AppHeader fromApp="true" />
					<Box height="100%">
						<Box className="appDesc">
							<Text size="medium" weight="bold">
								{constants.motto}
							</Text>
						</Box>
						<Box direction="row" align="center" pad="medium">
							<AppSearch></AppSearch>
						</Box>
						<Box align="center" justify="around">
							<IconDetails></IconDetails>
						</Box>
					</Box>
					<Footer height="20vh">
						<Box width="100%" direction="row" justify="center">
							<Button onClick={moveToAppContent} icon={<Down size="45px" color="rgba(19,20,49,.9)" />} hoverIndicator />
						</Box>
					</Footer>
				</Box>

				<Box flex="false" ref={appContent}>
					<EventFIlter />
					<Box flex="false" pad="large">
						<Box>
							<Text size="large" weight="bold">
								Browse By Category
							</Text>

							<Text>Find the right event</Text>
						</Box>
						<Box flex="false">
							<Button
								className="categoryButton"
								icon={
									<Box width="2.4rem" pad="small" round="medium" background="accent-4">
										<Attraction className="svgStrokeBlack" />
									</Box>
								}
								label="Festivals"
								onClick={() => {
									setRedirect('Festivals');
								}}
							/>
							<Button
								className="categoryButton"
								icon={
									<Box width="2.4rem" pad="small" round="medium" background="dark-1">
										<PlayFill />
									</Box>
								}
								label="Club Nights"
								onClick={() => {
									setRedirect('Club Nights');
								}}
							/>
							<Button
								className="categoryButton"
								icon={
									<Box width="2.4rem" pad="small" round="medium" background="neutral-3">
										<Music />
									</Box>
								}
								label="Concerts"
								onClick={() => {
									setRedirect('Concerts');
								}}
							/>

							<Button
								className="categoryButton"
								icon={
									<Box width="2.4rem" pad="small" round="medium" background="status-ok">
										<Trophy className="svgStrokeBlack svgFillWhite" />
									</Box>
								}
								label="Sports"
								onClick={() => {
									setRedirect('Sports');
								}}
							/>
							<Button
								className="categoryButton"
								icon={
									<Box width="2.4rem" pad="small" round="medium" background="status-critical">
										<Multimedia className="svgStrokeBlack svgFillWhite" />
									</Box>
								}
								label="Theatre & Comedy"
								onClick={() => {
									setRedirect('Theatre & Comedy');
								}}
							/>
							<Button
								className="categoryButton"
								icon={
									<Box width="2.4rem" pad="small" round="medium" background="accent-4">
										<Attraction className="svgStrokeBlack" />
									</Box>
								}
								label="Vouchers & Day Out"
								onClick={() => {
									setRedirect('Vouchers & Days Out');
								}}
							/>
						</Box>
					</Box>
					<Box flex="false" width="100%" className="marginTopBox" align="center">
						<Text textAlign="center" size="large" weight="bold">
							{`Get the best out of ${constants.productName}`}
						</Text>{' '}
						<Box width="100%" align="center" pad="small">
							<Text>Access your tickets offline,anytime</Text>
							<Text> Sell your tickets in just a few steps</Text>
						</Box>
					</Box>
					<Box width="100%" pad="large" className="marginTopBox">
						<Text size="medium">How It Works</Text>
						<video width="100%" height="240" controls="over" fit="cover" preload="metadata">
							<source key="video" src="about.mp4#t=0.5" type="video/mp4" />
						</video>
					</Box>
				</Box>
			</Box>
		</>
	);
}

export default App;
