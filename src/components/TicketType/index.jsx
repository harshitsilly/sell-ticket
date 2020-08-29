import React from 'react';
import { Box, Text, Button } from 'grommet';
import TicketGrpDetails from '../TicketGrpDetails';
import './index.scss';
export default ({ ticketType }) => {
	// const [showTicketAndType, setShowTicketAndType] = React.useState({ skip: true, type: null });

	// let setEventsDataYourTickets = () => {
	// 	console.log(dataYourTickets);
	// 	dataYourTickets &&
	// 		dataYourTickets.eventTickets[0] &&
	// 		setYourTickets(() => [...yourTickets, ...dataYourTickets.eventTickets[0].ticketsAvailable]);
	// 	dataYourTickets &&
	// 		dataYourTickets.eventTickets[0] &&
	// 		setNumberOfTickets(numberOfTickets => numberOfTickets + dataYourTickets.eventTickets[0].numberOfTickets.available);
	// };
	// let { data: dataYourTickets, loading: loadingYourTickets } = useQuery(Events_Tickets_Query, {
	// 	variables: { id, userTicket: true, passType: showTicketAndType.type },
	// 	skip: showTicketAndType.skip,
	// 	fetchPolicy: 'no-cache',
	// 	onCompleted: setEventsDataYourTickets
	// });
	// let setEventsDataTickets = () => {
	// 	dataTickets && dataTickets.eventTickets[0] && setYourTickets(() => [...tickets, ...dataTickets.eventTickets[0].ticketsAvailable]);
	// 	dataTickets &&
	// 		dataTickets.eventTickets[0] &&
	// 		setNumberOfTickets(numberOfTickets => numberOfTickets + dataTickets.eventTickets[0].numberOfTickets.available);
	// };
	// let { data: dataTickets, loading: loadingTickets } = useQuery(Events_Tickets_Query, {
	// 	variables: { id, userTicket: false, passType: showTicketAndType.type },
	// 	skip: showTicketAndType.skip,
	// 	fetchPolicy: 'no-cache',
	// 	onCompleted: setEventsDataTickets
	// });
	// let onClickTicketGrp = type => {
	// 	setShowTicketAndType({ skip: false, type });
	// };

	return (
		<>
			<Box pad="medium" className="eventList">
				{ticketType.length > 0 && ticketType.map(ticket => <TicketGrpDetails ticketColor="#FF698A" {...ticket} />)}
			</Box>
		</>
	);
};
