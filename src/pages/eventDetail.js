import React from 'react';
import { Box, Text, Button } from 'grommet';
import { useLocation } from 'react-router-dom';
import { Location, Calendar, Ticket, Notification } from 'grommet-icons';
import { Redirect } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import AppHeader from '../components/appHeader';
import TicketBadge from '../components/ticketBadge';
import TicketDetails from '../components/ticketDetails';
import TicketType from '../components/TicketType';
import SkeltonLoader from '../components/SkeltonLoader';
import Share from '../components/share';
import Switch from 'react-switch';

const Events_Detail_Query = gql`
	# Write your query or mutation here
	query Events($id: String!, $userTicket: Boolean, $first: Int, $skip: Int) {
		events(id: $id, userTicket: $userTicket, first: $first, skip: $skip) {
			id
			ticketType {
				type
				count
			}

			numberOfTickets {
				available
			}
		}
	}
`;

const Events_Tickets_Query = gql`
	# Write your query or mutation here
	query eventTickets($id: String!, $userTicket: Boolean, $passType: String, $first: Int, $skip: Int) {
		eventTickets(id: $id, userTicket: $userTicket, passType: $passType, first: $first, skip: $skip) {
			id

			numberOfTickets {
				available
			}
			ticketsAvailable {
				id
				user {
					firstName
					lastName
				}
				passType
				numberOfTickets
				cost
			}
		}
	}
`;

const POST_MUTATION_NOTIFY = gql`
	mutation NotifyEvent($eventId: String!, $notify: Boolean!) {
		notifyEvent(eventId: $eventId, notify: $notify) {
			data
		}
	}
`;
function EventDetail({ history }) {
	let { name, date, location, id } = useLocation().state;
	date = new Date(date);
	date = date.toLocaleString();
	const [tickets, setTickets] = React.useState([]);
	const [yourTickets, setYourTickets] = React.useState([]);
	const [numberOfTickets, setNumberOfTickets] = React.useState(0);
	const [showTicketAndType, setShowTicketAndType] = React.useState({ skip: true, type: null });
	const [showMore, setShowMore] = React.useState(false);
	const [firstSkip, setFirstSkip] = React.useState({ first: 7, skip: 0 });
	const [redirect, setRedirect] = React.useState();
	const [notify, setNotify] = React.useState(false);
	const [redirectToBuyTicket, setRedirectToBuyTicket] = React.useState();

	let onClickTicket = ticketDetails => {
		setRedirectToBuyTicket(ticketDetails);
	};

	const [postMutation, { loadingNotify, errorNotify }] = useMutation(POST_MUTATION_NOTIFY, {
		onCompleted(data) {
			console.log('sss');
		}
	});
	let onPressNotify = () => {
		postMutation({
			variables: {
				eventId: id,
				notify: !notify
			}
		});
		setNotify(!notify);
	};

	let setEventsData = () => {
		data && data.events[0] && setNumberOfTickets(numberOfTickets => numberOfTickets + data.events[0].numberOfTickets.available);
		if (data.events.length < 5) {
			setShowMore(false);
		} else {
			setShowMore(true);
		}
	};
	let { data, loading, error } = useQuery(Events_Detail_Query, {
		variables: { id, userTicket: false, first: firstSkip.first, skip: firstSkip.skip },
		fetchPolicy: 'no-cache',
		onCompleted: setEventsData
	});

	let setEventsDataYourTickets = () => {
		console.log(dataYourTickets);
		dataYourTickets &&
			dataYourTickets.eventTickets[0] &&
			setYourTickets(() => [...yourTickets, ...dataYourTickets.eventTickets[0].ticketsAvailable]);
		dataYourTickets &&
			dataYourTickets.eventTickets[0] &&
			setNumberOfTickets(numberOfTickets => numberOfTickets + dataYourTickets.eventTickets[0].numberOfTickets.available);
	};
	let { data: dataYourTickets, loading: loadingYourTickets } = useQuery(Events_Tickets_Query, {
		variables: { id, userTicket: true, passType: showTicketAndType.type },
		skip: showTicketAndType.skip,
		fetchPolicy: 'no-cache',
		onCompleted: setEventsDataYourTickets
	});
	let setEventsDataTickets = () => {
		dataTickets && dataTickets.eventTickets[0] && setYourTickets(() => [...tickets, ...dataTickets.eventTickets[0].ticketsAvailable]);
		dataTickets &&
			dataTickets.eventTickets[0] &&
			setNumberOfTickets(numberOfTickets => numberOfTickets + dataTickets.eventTickets[0].numberOfTickets.available);
	};
	let { data: dataTickets, loading: loadingTickets } = useQuery(Events_Tickets_Query, {
		variables: { id, userTicket: false, passType: showTicketAndType.type },
		skip: showTicketAndType.skip,
		fetchPolicy: 'no-cache',
		onCompleted: setEventsDataTickets
	});

	if (error) return `Error! ${error.message}`;
	if (redirect)
		return (
			<Redirect
				push="true"
				to={{
					pathname: `/sellTicket:${name}`,
					state: { name, date, location, id }
				}}
			/>
		);
	if (redirectToBuyTicket) {
		const { id: ticketId, cost, numberOfTickets, user } = redirectToBuyTicket;
		return (
			<Redirect
				push="true"
				to={{
					pathname: `/buyTicket:${ticketId}`,
					state: { name, date, location, id, ticketId, cost, numberOfTickets, user }
				}}
			/>
		);
	}
	return (
		<>
			<Box height="460px" flex="false">
				<AppHeader history={history} />
				<Box className="eventDetailHeaderParent" flex="false">
					<Box className="eventDetailHeader">
						<Text size="large" weight="bold">
							{name}
						</Text>
					</Box>
					<Box pad="medium" justify="evenly" className="eventDetailSubHeader">
						<Box direction="row" justify="between">
							<Box className="marginBottom1rem" justify="start" direction="row">
								<TicketBadge type="AVAILABLE" ticketsAvailable={numberOfTickets} />
								<TicketBadge type="SOLD" ticketsAvailable="25" />
								<TicketBadge type="WANTED" ticketsAvailable="65" />
							</Box>
							<Share />
						</Box>

						<Box className="bottomMargindot5rem eventDetailTime" justify="start" align="center" direction="row">
							<Calendar color="grey" />
							{date}
						</Box>
						<Box className="marginBottom1rem eventDetailTime" justify="start" align="center" direction="row">
							<Location color="grey" />
							{location}
						</Box>

						<Button
							primary
							className="sellTicketV2"
							color="status-ok"
							label="Sell Tickets for this event"
							onClick={() => {
								setRedirect(true);
							}}
						/>
					</Box>
				</Box>

				<div className="eventDetailBackground" />
			</Box>
			<Box>
				{data && data.events[0].ticketType && (
					<>
						<Box pad="medium" align="center" direction="row">
							<>
								<Text className="eventTicketText" size="large" weight="bold">
									Tickets
								</Text>
								<div ticket-data={numberOfTickets} className="eventTicket">
									<Ticket color="white" />
									<Text size="1rem">{numberOfTickets}</Text>
								</div>
							</>

							{numberOfTickets === 0 && (
								<Box direction="row-reverse" width="100%">
									<Box direction="row" align="center">
										<Text className="notifyText" color="#00b6f0">
											Notify{' '}
										</Text>
										<Switch
											onChange={onPressNotify}
											checked={notify}
											handleDiameter={28}
											offColor="#d3d3d3"
											onColor="#00b6f0"
											offHandleColor="#00b6f0"
											onHandleColor="#08f"
										/>
									</Box>
								</Box>
							)}
						</Box>
						<TicketType ticketType={data.events[0].ticketType} />
					</>
				)}
				{loading && <SkeltonLoader />}
			</Box>
			{!showTicketAndType.skip && (
				<Box>
					<Box>
						{!loadingYourTickets && dataYourTickets && yourTickets.length > 0 && (
							<>
								<Box pad="medium" className="eventList">
									<Box direction="row">
										<Text className="eventTicketText" size="large" weight="bold">
											Your Listing
										</Text>
										<div
											ticket-data={dataYourTickets.eventTickets[0].numberOfTickets.available}
											ticket-color="#FF698A"
											className="eventTicket"
										>
											<Ticket color="white" />
											<Text size="1rem">{dataYourTickets.eventTickets[0].numberOfTickets.available}</Text>
										</div>
									</Box>
									{yourTickets.length > 0 &&
										yourTickets.map(ticket => <TicketDetails ticketColor="#FF698A" {...ticket} />)}
								</Box>
							</>
						)}
						{!loadingTickets && dataTickets && tickets.length > 0 && (
							<>
								<Box pad="medium" className="eventList">
									{tickets.length > 0 && (
										<Box direction="row">
											<Text className="eventTicketText" size="large" weight="bold">
												All Tickets
											</Text>
											<div ticket-data={data.eventTickets[0].numberOfTickets.available} className="eventTicket">
												<Ticket color="white" />
												<Text size="1rem">{data.eventTickets[0].numberOfTickets.available}</Text>
											</div>
										</Box>
									)}
									{tickets.length === 0 && yourTickets.length === 0 && (
										<Text weight="bold">Sold Out. Check back later.</Text>
									)}
									{tickets.length > 0 &&
										tickets.map(ticket => <TicketDetails onClickTicket={onClickTicket} {...ticket} />)}
								</Box>
							</>
						)}
						{loadingYourTickets && (
							<Box pad="medium" className="skeletonEvent">
								<div class="post">
									<div class="avatar"></div>
									<div class="line"></div>
									<div class="line"></div>
									<div class="ticket"></div>
								</div>
								<div class="post">
									<div class="avatar"></div>
									<div class="line"></div>
									<div class="line"></div>
								</div>
								<div class="post">
									<div class="avatar"></div>
									<div class="line"></div>
									<div class="line"></div>
								</div>
							</Box>
						)}
					</Box>
				</Box>
			)}
		</>
	);
}

export default EventDetail;
