import React, { useContext } from 'react';
import { Button, Box, Form, FormField, Text, TextInput, Select } from 'grommet';
import { Calendar, Location, Validate } from 'grommet-icons';
import { useLocation } from 'react-router-dom';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';
import AppHeader from '../components/appHeader';
import Loader from '../components/loader';
import { UserContext } from '../context/user';

const POST_MUTATION = gql`
	mutation BuyTicket($ticketIds: [String]!) {
		buyTicket(ticketIds: $ticketIds) {
			text
		}
	}
`;
function BuyTicket() {
	const { userData } = useContext(UserContext);

	const { id, name, date, location, user, ticketId, numberOfTickets, cost } = useLocation().state;
	console.log(id);

	let [postMutation, { loading, error }] = useMutation(POST_MUTATION, {
		onCompleted() {
			setRedirectToApp(true);
		}
	});
	const onClickBuyButton = () => {
		postMutation({
			variables: {
				ticketIds: [ticketId]
			}
		});
	};
	const [redirectToLogin, setRedirectToLogin] = React.useState(false);
	const [redirectToApp, setRedirectToApp] = React.useState(false);
	const [ticketIds, setTicketIds] = React.useState([]);
	const [value, setValue] = React.useState('1');
	// if (!userData.currentUser) {
	// 	setTimeout(() => {
	// 		setRedirectToLogin(true);
	// 		userData.currentUser = 'test';
	// 	}, 1000);
	// }

	if (loading) return <Loader />;
	if (error) return `Error! ${error.message}`;
	if (redirectToLogin) {
		return <Redirect push="true" to="/login" />;
	} else if (redirectToApp) {
		return (
			<Redirect
				to={{
					pathname: `/eventDetail:${name}`,
					state: { id, name, date, location }
				}}
			/>
		);
	} else {
		return (
			<Box flex="false">
				{!userData.currentUser && (
					<Box align="center" justify="center">
						<Loader text="User not login. Redirecting To Login Page" />
					</Box>
				)}
				{userData.currentUser && (
					<>
						<AppHeader />
						<Box className="eventDetailHeaderParent sellTicketHeaderParent" flex="false">
							<Box className="eventDetailHeader">
								<Text size="large" weight="bold">
									{name}
								</Text>
							</Box>
							<Box pad="medium" justify="evenly" className="eventDetailSubHeader">
								<Box className="bottomMargindot5rem eventDetailTime" justify="start" align="center" direction="row">
									<Calendar color="grey" />
									{date}
								</Box>
								<Box className="marginBottom1rem eventDetailTime" justify="start" align="center" direction="row">
									<Location color="grey" />
									{location}
								</Box>
							</Box>
						</Box>
						<div className="sellTicketBackground eventDetailBackground" />

						<Box pad="medium" className="buyTicketPaddingTop">
							<Box pad="medium" className="buyTicketFormBox">
								<Box pad="medium" align="center">
									<img className="buyTicketLogo" src="logo/logo_transparent.png" alt="" />
								</Box>
								<Box direction="row" justify="around">
									<Box gap="medium" align="start">
										<Text weight="bold">Sold By</Text>
										<Text weight="bold">Tickets</Text>
										<Text weight="bold">Cost/Ticket</Text>
										<Text weight="bold">&nbsp;</Text>
										<Text weight="bold">Total Cost</Text>
									</Box>
									<Box gap="medium" align="end">
										<Text>{`${user.firstName} ${user.lastName}`}</Text>
										<Text>{numberOfTickets}</Text>
										<Box direction="row" align="center" className="ticketCostBuyTicket" size="1rem">
											<img src="rupee.svg" alt=""></img>
											{cost}
										</Box>

										<Text className="ticketCostCalculator">
											{numberOfTickets} &#215; {cost}
										</Text>
										<Box direction="row" align="center" className="ticketCost" size="1rem">
											<img src="rupee.svg" alt=""></img>
											{numberOfTickets * cost}
										</Box>
									</Box>
								</Box>

								<Box className="buyTicketButtonBox" direction="row" width="100%" pad="small" justify="center">
									<Button primary label="Buy" onClick={onClickBuyButton} />
								</Box>
								<Box className="verified" direction="row" width="100%" pad="small" justify="end">
									<Validate />
									<Text>verified</Text>
								</Box>
							</Box>
						</Box>
					</>
				)}
			</Box>
		);
	}
}

export default BuyTicket;
