import React from 'react';
import { Box, Text, Button } from 'grommet';
import { useLocation } from 'react-router-dom';
import { Location, Calendar, Ticket } from 'grommet-icons';
import { Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import AppHeader from '../components/appHeader';
import TicketBadge from '../components/ticketBadge';
import TicketDetails from '../components/ticketDetails';

const Events_Detail_Query = gql`
	# Write your query or mutation here
	query Events($id: String!, $first: Int, $skip: Int) {
		events(id: $id, first: $first, skip: $skip) {
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

function EventDetail() {
	let { name, date, location, id } = useLocation().state;
	date = new Date(date);
	date = date.toLocaleString();
	const [tickets, setTickets] = React.useState([]);
	const [numberOfTickets, setNumberOfTickets] = React.useState({});
	const [showMore, setShowMore] = React.useState(false);
	const [firstSkip, setFirstSkip] = React.useState({ first: 7, skip: 0 });
	const [redirect, setRedirect] = React.useState();
	const [redirectToBuyTicket, setRedirectToBuyTicket] = React.useState();
	let onClickTicket = ticketDetails => {
		setRedirectToBuyTicket(ticketDetails);
	};
	let setEventsData = () => {
		data && setTickets(() => [...tickets, ...data.events[0].ticketsAvailable]);
		setNumberOfTickets(data.events[0].numberOfTickets);
		if (data.events.length < 5) {
			setShowMore(false);
		} else {
			setShowMore(true);
		}
	};
	const { loading, error, data } = useQuery(Events_Detail_Query, {
		variables: { id, first: firstSkip.first, skip: firstSkip.skip },
		fetchPolicy: 'no-cache',
		onCompleted: setEventsData
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
				<AppHeader />
				<Box className="eventDetailHeaderParent" flex="false">
					<Box className="eventDetailHeader">
						<Text size="large" weight="bold">
							{name}
						</Text>
					</Box>
					<Box pad="medium" justify="evenly" className="eventDetailSubHeader">
						<Box className="marginBottom1rem" justify="start" direction="row">
							<TicketBadge type="AVAILABLE" ticketsAvailable={numberOfTickets.available} />
							<TicketBadge type="SOLD" ticketsAvailable="25" />
							<TicketBadge type="WANTED" ticketsAvailable="65" />
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
				<Box pad="medium" direction="row">
					<Text className="eventTicketText" size="large" weight="bold">
						Tickets
					</Text>
					<div ticket-Data={numberOfTickets.available} className="eventTicket">
						<Ticket color="white" />
						<Text size="1rem">{numberOfTickets.available}</Text>
					</div>
				</Box>
				<Box>
					{data && (
						<>
							<Box pad="medium" className="eventList">
								{tickets.length === 0 && <Text weight="bold">Sold Out. Check back later.</Text>}
								{tickets.length > 0 && tickets.map(ticket => <TicketDetails onClickTicket={onClickTicket} {...ticket} />)}
							</Box>
						</>
					)}
					{loading && (
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
		</>
	);
}

export default EventDetail;
