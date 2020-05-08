import React, { useContext } from 'react';
import { Button, Box, Form, FormField, Text, TextInput, TextArea, Select } from 'grommet';
import { Calendar, Location, Chat, Tag, Ticket } from 'grommet-icons';
import { useLocation } from 'react-router-dom';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';
import AppHeader from '../components/appHeader';
import Loader from '../components/loader';
import { UserContext } from '../context/user';

const POST_MUTATION = gql`
	mutation AddTicket($passType: String!, $numberOfTickets: Int!, $cost: Int!, $event: String!, $comments: String) {
		addTicket(passType: $passType, numberOfTickets: $numberOfTickets, cost: $cost, event: $event, comments: $comments) {
			ticket {
				id
			}
		}
	}
`;
function StartSelling() {
	const { userData } = useContext(UserContext);

	const { id, name, date, location } = useLocation().state;
	console.log(id);

	let [postMutation, { loading, error }] = useMutation(POST_MUTATION, {
		onCompleted() {
			setRedirectToApp(true);
		}
	});
	const onPressSubmitPasswordForm = formData => {
		postMutation({
			variables: {
				...formData.value,
				numberOfTickets: parseInt(formData.value.numberOfTickets),
				cost: parseInt(formData.value.cost),
				event: id
			}
		});
	};
	const [redirectToLogin, setRedirectToLogin] = React.useState(false);
	const [redirectToApp, setRedirectToApp] = React.useState(false);
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
			<Box height="100vh" className="ticketSellMainBG" flex="false">
				{!userData.currentUser && (
					<Box align="center" justify="center">
						<Loader text="User not login. Redirecting To Login Page" />
					</Box>
				)}
				{userData.currentUser && (
					<>
						<div className="ticketSellBG1"> </div>
						<div className="ticketSellBG2"> </div>
						<AppHeader />
						<Box className="sellTicketHeader" flex="false" align="center">
							<Box className="eventDetailHeader">
								<Text size="large" weight="bold">
									{name}
								</Text>
							</Box>
							<Box pad="medium" justify="evenly" align="center" className="eventDetailSubHeader">
								<Box className="bottomMargindot5rem eventDetailTime" justify="start" align="center" direction="row">
									<Calendar color="white" />
									{date}
								</Box>
								<Box className="marginBottom1rem eventDetailTime" justify="start" align="center" direction="row">
									<Location color="white" />
									{location}
								</Box>
							</Box>
						</Box>

						<Box pad="medium" className="sellTicketFormBox">
							<Form onSubmit={onPressSubmitPasswordForm}>
								<Box className="loginForm" pad="large" gap="small">
									<FormField
										name="numberOfTickets"
										required
										component={props => (
											<Box direction="row" align="center">
												<div className="eventTicketV2">
													<Ticket color="white" />
												</div>
												{/* <Select
													{...props}
													className="ticketSelect"
													options={[...Array(5).keys()].slice(1)}
													valueKey="value"
												/> */}
												<TextInput type="number" {...props} placeholder="Tickets To Sell"></TextInput>
											</Box>
										)}
									/>
									<FormField
										name="passType"
										required
										component={props => (
											<Box direction="row" align="center">
												<Box width="2.4rem" pad="small" round="medium" background="status-error">
													<Tag className="svgStrokeBlack svgFillWhite" />
												</Box>
												{/* <Tag className="licenseTransformScale" /> */}
												<TextInput {...props} placeholder="Ticket Type"></TextInput>
											</Box>
										)}
									/>
									<FormField
										name="cost"
										required
										component={props => (
											<Box direction="row" align="center">
												<div className="ticketCost sellTicketCost">
													<img src="rupee.svg" alt="" />
												</div>

												<TextInput {...props} placeholder="Cost per ticket"></TextInput>
											</Box>
										)}
									/>
									<FormField
										name="comments"
										component={props => (
											<Box direction="row" align="center" justify="center" className="sellTicketComment">
												<Box width="2.4rem" pad="small" round="medium" background="status-warning">
													<Chat className="licenseTransformScale svgStrokeBlack" />
												</Box>

												<TextArea {...props} placeholder="Comments"></TextArea>
											</Box>
										)}
									/>
								</Box>
								<Box direction="row" width="100%" pad="small" justify="center">
									<Button className="sellButton" color="brand" type="submit" primary label="Sell" />
								</Box>
							</Form>
						</Box>
					</>
				)}
			</Box>
		);
	}
}

export default StartSelling;
