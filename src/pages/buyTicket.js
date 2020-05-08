import React, { useContext, useLayoutEffect } from 'react';
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
	mutation BuyTicket($ticketIds: [String]!, $noOfTickets: Int!) {
		buyTicket(ticketIds: $ticketIds, noOfTickets: $noOfTickets) {
			text
		}
	}
`;
function BuyTicket() {
	const { userData } = useContext(UserContext);
	const ticketBGRef = React.createRef(null);
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
				ticketIds: [ticketId],
				noOfTickets: value
			}
		});
	};
	useLayoutEffect(() => {
		ticketBGRef.current && (ticketBGRef.current.style.width = window.innerWidth - 32 + 'px');
	});
	const [redirectToLogin, setRedirectToLogin] = React.useState(false);
	const [redirectToApp, setRedirectToApp] = React.useState(false);
	const [ticketIds, setTicketIds] = React.useState([]);
	const [value, setValue] = React.useState(1);
	if (!userData.currentUser) {
		setTimeout(() => {
			setRedirectToLogin(true);
			userData.currentUser = 'test';
		}, 1000);
	}

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
			<Box flex="false" height="100vh">
				{!userData.currentUser && (
					<Box align="center" justify="center">
						<Loader text="User not login. Redirecting To Login Page" />
					</Box>
				)}
				{userData.currentUser && (
					<>
						<AppHeader />
						<div className="ticketBuyBG1"> </div>

						<div className="ticketBuyCircle"></div>
						<Box background="light-1" className="ticketSell ticketSellRadius ticketBuyCircle">
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

							<div ref={ticketBGRef} className="sellTicketBackground eventDetailBackground" />

							<Box pad="medium" className="buyTicketPaddingTop">
								<Box className="qrCode" align="end">
									<img src="qr_code.png" alt="" />
								</Box>
								<Box pad="medium">
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
											<Select
												className="ticketSelect"
												options={[...Array(numberOfTickets + 1).keys()].slice(1)}
												value={value}
												onChange={({ option }) => setValue(option)}
											/>
											{/* <Text>{numberOfTickets}</Text> */}
											<Box direction="row" align="center" className="ticketCostBuyTicket" size="1rem">
												<img src="rupee.svg" alt=""></img>
												{cost}
											</Box>

											<Text className="ticketCostCalculator">
												{value} &#215; {cost}
											</Text>
											<Box direction="row" align="center" className="ticketCost" size="1rem">
												<img src="rupee.svg" alt=""></img>
												{value * cost}
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
						</Box>
					</>
				)}
			</Box>
		);
	}
}

export default BuyTicket;
