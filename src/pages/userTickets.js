import React, { useContext, useLayoutEffect } from 'react';
import { Text, Button, Box } from 'grommet';
import { Calendar, Location, Trophy, Tag, Ticket, Directions } from 'grommet-icons';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const CURRENT_USER_TICKET = gql`
	# Write your query or mutation here
	{
		userTickets {
			id
			tickets {
				id
				name
				passType
				date
				location
				numberOfTickets
			}
		}
	}
`;
function UserTicket() {
	const [userTicketData, setUserTicketData] = React.useState([]);

	const { loading, error, data } = useQuery(CURRENT_USER_TICKET, {
		fetchPolicy: 'no-cache',
		onCompleted: () => {
			setUserTicketData(data.userTickets.tickets);
		}
	});
	const openMap = () => {
		window.open('https://www.google.com/maps/dir/?api=1&origin=current+location&destination=bangalore&travelmode=driving');
	};
	return (
		<>
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
			{!loading &&
				userTicketData.map(({ date, location, passType, name, numberOfTickets }) => {
					date = new Date(date);
					date = date.toLocaleString();
					return (
						<Box className="userTicketBox">
							<Box className="bottomMargindot5rem userTicketDetail" justify="start" align="center" direction="row">
								<Box width="2.4rem" pad="small" round="medium" background="accent-4">
									<Trophy className="svgStrokeBlack svgFillWhite" />
								</Box>
								<Text weight="bold">{name}</Text>
							</Box>
							<Box justify="between" align="center" direction="row">
								<Box className="bottomMargindot5rem userTicketDetail" direction="row" align="center">
									<Box width="2.4rem" pad="small" round="medium" background="status-error">
										<Tag className="svgStrokeBlack svgFillWhite" />
									</Box>

									<Text>{passType}</Text>
								</Box>
								<Box className="bottomMargindot5rem userTicketDetail" direction="row" align="center">
									<div ticket-Data={numberOfTickets} className="eventTicket">
										<Ticket color="white" />
										<Text size="1rem">{numberOfTickets}</Text>
									</div>
								</Box>
							</Box>
							<Box className="bottomMargindot5rem userTicketDetail" justify="start" align="center" direction="row">
								<Box width="2.4rem" pad="small" round="medium" background="status-ok">
									<Calendar className="svgStrokeBlack svgFillWhite" />
								</Box>
								<Text>{date}</Text>
							</Box>
							<Box className="marginBottom1rem userTicketDetail" justify="start" align="center" direction="row">
								<Box width="2.4rem" pad="small" round="medium" background="brand">
									<Location />
								</Box>
								<Box className="userTicketLocation" direction="row" width="100%" align="center" justify="between">
									<Text>{location}</Text>
									<Button primary color="brand" icon={<Directions />} onClick={openMap} label="Nav"></Button>
								</Box>
							</Box>
						</Box>
					);
				})}
		</>
	);
}

export default UserTicket;
