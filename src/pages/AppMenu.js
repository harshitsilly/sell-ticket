import React, { useContext } from 'react';
import { Button, Box, Text, Avatar } from 'grommet';
import { Next, User } from 'grommet-icons';
import { Redirect } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Loader from '../components/loader';
import UserTickets from '../pages/userTickets';
import { UserContext } from '../context/user';
const POST_MUTATION = gql`
	mutation {
		logout
	}
`;
function AppMenu() {
	let { userData } = useContext(UserContext);

	userData = userData.currentUser;
	let [postMutation, { loading, error: mutationError }] = useMutation(POST_MUTATION, {
		onCompleted({ login }) {
			setRedirect('login');
		}
	});
	const onPressLogout = postMutation;
	const [redirect, setRedirect] = React.useState(false);
	const [userTicket, setUserTicket] = React.useState(false);
	const onPressYourTickets = () => {
		setUserTicket(true);
	};
	if (loading) return <Loader />;
	if (redirect) {
		return <Redirect push="true" to="/login" />;
	} else {
		return (
			<>
				<Box pad="medium" justify="between" height="100vh">
					{userData && (
						<>
							<Box direction="row" align="center" pad="medium" gap="large">
								<Text weight="bold" color="dark-2" size="20px">
									Welcome {userData.firstName}
								</Text>
								<Avatar className="avatarSize" background="brand">
									<User color="white" />
								</Avatar>
							</Box>

							{/* <Button
								reverse
								className="appMenuYourTickets"
								icon={<Next />}
								label="Your Tickets"
								onClick={onPressYourTickets}
							/> */}
							<Button reverse className="appMenuButton" icon={<Next />} label="Your Tickets" onClick={onPressYourTickets} />
						</>
					)}
					{userTicket && (
						<div className="appUserTicketsBox">
							<UserTickets />
						</div>
					)}
					{!userTicket && (
						<Box className="appMenuButtonsBox">
							{/* <Text size="large" weight="bold">
								Upcoming
							</Text> */}
							{!userData && (
								<Button reverse className="appMenuButton" icon={<Next />} label="Login" onClick={() => setRedirect(true)} />
							)}

							{userData && (
								<Button reverse className="appMenuButton" icon={<Next />} label="Logout" onClick={onPressLogout} />
							)}
							<Button reverse className="appMenuButton" icon={<Next />} label="Sell Tickets" onClick={() => {}} />
							{/* <Button reverse className="appMenuButton" icon={<Next />} label="How It Works" onClick={() => {}} /> */}
							<Button reverse className="appMenuButton" icon={<Next />} label="About Us" onClick={() => {}} />
							<Button reverse className="appMenuButton" icon={<Next />} label="FAQ" onClick={() => {}} />
							<Button reverse className="appMenuButton" icon={<Next />} label="Help" onClick={() => {}} />
						</Box>
					)}
				</Box>
			</>
		);
	}
}

export default AppMenu;
