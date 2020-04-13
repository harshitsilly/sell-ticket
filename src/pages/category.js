import React from 'react';
import { Button, Box, Form, FormField, Text, Footer } from 'grommet';
import { Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import LocaltionFiler from '../components/localtionFiler';
import DateFiler from '../components/dateFilter';
import CategoryFilter from '../components/categoryFilter';
import AppHeader from '../components/appHeader';
import RandomGeneratedColor from '../components/randomGeneratedColor';
import ShowMore from '../components/showMore';
import Event from '../components/event';
import Loader from 'react-loader-spinner';

const Events_Query = gql`
	# Write your query or mutation here
	query Events($category: String!) {
		events(category: $category) {
			id
			name
			category
			date
			location
			ticketsAvailable {
				id
				info
			}
		}
	}
`;
function Category(props) {
	let category = props.match.params[0];
	const [events, setEvents] = React.useState([]);
	const [headerClass, setHeaderClass] = React.useState('positionSticky');

	category = category.charAt(0).toUpperCase() + category.slice(1);
	window.addEventListener('scroll', event => {
		if (window.pageYOffset + 60 > (window.screen.height / 100) * 25) {
			setHeaderClass('positionFixed');
		} else {
			setHeaderClass('positionSticky');
		}
	});
	let onClickEvent = name => {
		setRedirectToEventDetail(name);
	};
	let loadEvents = () => {
		setEvents(() => [...events]);
	};
	const [redirectToEventDetail, setRedirectToEventDetail] = React.useState('');

	const { loading, error, data } = useQuery(Events_Query, {
		variables: { category },
		fetchPolicy: 'no-cache'
	});

	if (error) return `Error! ${error.message}`;

	if (redirectToEventDetail) {
		return <Redirect push="true" to={`/eventDetail:${redirectToEventDetail}`} />;
	} else {
		return (
			<>
				<Box>
					<Box className="categoryHeder" height="25vh">
						<AppHeader style={{ backgroundColor: props.styleColor }} className={headerClass} header={category} />
						<Box pad="medium" justify="center" align="center">
							<Text color="#fff" weight="bold" size="large">
								{category}
							</Text>
						</Box>

						<Box style={{ backgroundColor: props.styleColor }} className="categoryBackground"></Box>
					</Box>
					<Box className={headerClass === 'positionSticky' ? 'filterBox' : 'filterBoxRow'}>
						<LocaltionFiler />
						<DateFiler />
					</Box>
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
					{data && (
						<>
							<Box pad="medium" className="eventList">
								{data.events.length === 0 && <Text weight="bold">No Events Found</Text>}
								{data.events.length > 0 &&
									data.events.map(event => (
										<Event
											key={event.ticketsAvailable}
											onClick={() => onClickEvent(event.name)}
											{...props}
											{...event}
										/>
									))}
							</Box>
							{data.events.length > 0 && (
								<Box pad="medium">
									<ShowMore onClick={loadEvents} />
								</Box>
							)}
						</>
					)}
				</Box>
			</>
		);
	}
}
export default Category;
