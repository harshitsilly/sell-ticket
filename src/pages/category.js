import React, { useEffect, useLayoutEffect } from 'react';
import { Box, Text } from 'grommet';
import { Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import LocaltionFiler from '../components/localtionFiler';
import DateFiler from '../components/dateFilter';
import AppHeader from '../components/appHeader';
import ShowMore from '../components/showMore';
import Event from '../components/event';

const Events_Query = gql`
	# Write your query or mutation here
	query Events($category: String!, $location: String, $first: Int, $skip: Int) {
		events(category: $category, location: $location, first: $first, skip: $skip) {
			id
			name
			category
			date
			location
			numberOfTickets {
				available
			}
		}
	}
`;
function Category(props) {
	let category = props.match.params[0];
	const [events, setEvents] = React.useState([]);
	const [showMore, setShowMore] = React.useState(false);
	const [appHeaderClass, setAppHeaderClass] = React.useState('positionSticky');
	const [headerClass, setheaderClass] = React.useState('');
	const [firstSkip, setFirstSkip] = React.useState({ first: 7, skip: 0 });
	const [location, setLocation] = React.useState('');
	category = category.charAt(0).toUpperCase() + category.slice(1);
	window.addEventListener('scroll', event => {
		if (window.pageYOffset > 50) {
			setAppHeaderClass('positionFixed');
			setheaderClass('categoryHeaderHeight');
		} else {
			setAppHeaderClass('positionSticky');
			setheaderClass('');
		}
	});
	let setLocationCallback = selectedLocation => {
		location !== selectedLocation && setEvents([]);
		setLocation(selectedLocation);
	};
	let onClickEvent = event => {
		setRedirectToEventDetail(event);
	};
	const showMoreRef = React.useRef();
	let loadEvents = () => {
		setFirstSkip({ first: 5, skip: firstSkip.first + firstSkip.skip });
	};
	const [redirectToEventDetail, setRedirectToEventDetail] = React.useState('');
	let setEventsData = () => {
		data && setEvents(() => [...events, ...data.events]);
		if (data.events.length < 5) {
			setShowMore(false);
		} else {
			setShowMore(true);
		}
	};
	useLayoutEffect(() => {
		if (events.length > 7 && showMoreRef.current) {
			let showMoreTop = showMoreRef.current.offsetTop;
			window.scrollTo({ top: showMoreTop });
		}
	}, [events]);
	const { loading, error, data } = useQuery(Events_Query, {
		variables: { category, location, first: firstSkip.first, skip: firstSkip.skip },
		fetchPolicy: 'no-cache',
		onCompleted: setEventsData
	});
	if (error) return `Error! ${error.message}`;

	if (redirectToEventDetail) {
		return (
			<Redirect
				push="true"
				to={{
					pathname: `/eventDetail:${redirectToEventDetail.name}`,
					state: redirectToEventDetail
				}}
			/>
		);
	} else {
		return (
			<>
				<Box>
					<Box className={`${headerClass} categoryHeder`} height="25vh">
						<AppHeader
							history={props.history}
							style={{ backgroundColor: props.styleColor }}
							className={appHeaderClass}
							header={category}
						/>
						<Box pad="medium" justify="center" align="center">
							<Text color="#fff" size="40px">
								{category}
							</Text>
						</Box>

						<Box style={{ backgroundColor: props.styleColor }} className="categoryBackground"></Box>
						<Box style={{ backgroundColor: props.styleColor }} className="categoryBackground2"></Box>
					</Box>
					<Box className={appHeaderClass === 'positionSticky' ? 'filterBox' : 'filterBoxRow'}>
						<LocaltionFiler setLocationCallback={setLocationCallback} />
						<DateFiler />
					</Box>

					{data && (
						<>
							<Box
								pad="medium"
								className={appHeaderClass === 'positionSticky' ? 'eventList' : 'eventList eventListPaddingTop'}
							>
								{events.length === 0 && <Text weight="bold">No Events Found</Text>}
								{events.length > 0 &&
									events.map(event => <Event key={event.id} onClick={() => onClickEvent(event)} {...props} {...event} />)}
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
					{showMore && (
						<Box ref={showMoreRef} pad="medium">
							<ShowMore onClick={loadEvents} />
						</Box>
					)}
				</Box>
			</>
		);
	}
}
export default Category;
