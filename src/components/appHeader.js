import React, { useContext } from 'react';

import { Box, Header, Button, Layer, Text } from 'grommet';
import { Ticket, Close, Menu } from 'grommet-icons';
import { Redirect } from 'react-router-dom';

import AppMenu from '../pages/AppMenu';

import BackButton from '../components/backButton';

function AppHeader({ className, style, header, fromApp, back, history }) {
	const [redirectToApp, setRedirectToApp] = React.useState(false);
	const setModalShow = state => {
		setCssAnim(state);
		setTimeout(() => {
			setShow(state);
		}, 0);
	};

	const popUpRef = React.useRef();
	const [show, setShow] = React.useState();

	const [cssAnim, setCssAnim] = React.useState();
	if (redirectToApp && fromApp !== 'true') {
		return <Redirect push="true" to="/" />;
	} else {
		return (
			<>
				<Header style={style} className={className ? `${className} appMenuHeader` : 'appMenuHeader'}>
					{!back && (
						<Box pad="small" direction="row" align="center">
							<Box
								onClick={() => {
									setRedirectToApp(true);
								}}
							>
								<img className="appLogoHeader" src="logo/logo_white.png" alt="" />
							</Box>
						</Box>
					)}
					{back && <BackButton history={history} color="light-1" />}
					<Button icon={<Menu color="#ffffff" />} onClick={() => setModalShow(true)} hoverIndicator />
					{show && (
						<Layer
							ref={popUpRef}
							className={cssAnim ? 'appMenuPage' : ''}
							onEsc={() => setModalShow(false)}
							onClickOutside={() => setModalShow(false)}
						>
							<Header className="appMenuHeader">
								<Box pad="small" direction="row" align="center">
									<Box
										onClick={() => {
											setRedirectToApp(true);
										}}
									>
										<img className="appLogoHeader" src="logo/logo_black.png" alt="" />
									</Box>
								</Box>
								<Button icon={<Close color="dark-1" />} onClick={() => setModalShow(false)} />
							</Header>
							<AppMenu />
						</Layer>
					)}
				</Header>
			</>
		);
	}
}

export default AppHeader;
