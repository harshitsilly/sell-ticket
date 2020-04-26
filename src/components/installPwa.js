import { Box, Text, Button } from 'grommet';
import React from 'react';

function InstallPwa({ event }) {
	window.addEventListener('beforeinstallprompt', e => {
		// Prevent the mini-infobar from appearing on mobile
		e.preventDefault();
		// Stash the event so it can be triggered later.
		setDeferredPrompt(e);
		// Update UI notify the user they can install the PWA
	});
	const [deferredPrompt, setDeferredPrompt] = React.useState(false);
	const [displayClass, setDisplayClass] = React.useState(false);
	const onClickNotNow = () => {
		setDisplayClass(true);
	};
	const onClickInstall = () => {
		setDisplayClass(true);
		// Show the install prompt
		deferredPrompt.prompt();
		// Wait for the user to respond to the prompt
		deferredPrompt.userChoice.then(choiceResult => {
			if (choiceResult.outcome === 'accepted') {
				console.log('User accepted the install prompt');
			} else {
				console.log('User dismissed the install prompt');
			}
		});
	};
	if (deferredPrompt) {
		return (
			<>
				<Box
					className={displayClass ? 'installPwaDsiplayNone' : 'installPwa'}
					round="medium"
					background="#7F38FB"
					pad="medium"
					height="160px"
					justify="between"
					align="start"
				>
					<Box className="installAppLogo" gap="medium" direction="row">
						<img src="sell_ticket/res/mipmap-xxhdpi/sell_ticket.png" alt="" />
						<Box>
							<Text>Keep Ticketing</Text>
							<Text>Our app is fast,small and works offline</Text>
						</Box>
					</Box>
					<Box width="100%" className="installAppButton" direction="row" align="center" justify="end">
						<Button plain label="Not now" onClick={onClickNotNow}></Button>
						<Button primary color="#ffffff" onClick={onClickInstall} label="Install"></Button>
					</Box>
				</Box>
			</>
		);
	}
	return <></>;
}

export default InstallPwa;
