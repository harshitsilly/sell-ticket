import React, { useLayoutEffect } from 'react';
import { Text, Box, TextInput, Button } from 'grommet';
import { Search } from 'grommet-icons';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';
import Event from '../components/event';
import FilterButton from '../components/filterButton';
import BackButton from '../components/backButton';
const QUERY_SEARCH = gql`
	# Write your query or mutation here
	query SearchResult($query: String!, $type: [SearchFormat]) {
		eventsSearch(query: $query, queryType: $type) {
			id
			name
			category
			date
			location
		}
	}
`;

function SearchPage({ history }) {
	const [events, setEvents] = React.useState([]);
	const [value, setValue] = React.useState('');
	const [type, setType] = React.useState([]);
	const [headerClass, setheaderClass] = React.useState('');
	const [redirectToEventDetail, setRedirectToEventDetail] = React.useState(false);
	const searchRef = React.createRef();
	const searchPageRef = React.createRef();
	window.addEventListener('scroll', event => {
		if (window.pageYOffset + 125 > (window.screen.height / 100) * 25) {
			setheaderClass('categoryHeaderHeight');
		} else {
			setheaderClass('');
		}
	});
	let onClickEvent = event => {
		setRedirectToEventDetail(event);
	};
	useLayoutEffect(() => {
		searchRef.current && searchRef.current.focus();
		// searchPageRef.current && (searchPageRef.current.height = window.innerHeight + 'px');
	});
	let setFilter = (searchType, addFilter) => {
		if (addFilter) {
			setType(type => [...type, searchType]);
		} else {
			setType(type => type.filter(element => element !== searchType));
		}
	};
	const onSearch = event => {
		setValue(event.target.value);
	};
	let setSearchData = () => {
		data && setEvents(() => [...data.eventsSearch]);
	};
	const { loading, error, data } = useQuery(QUERY_SEARCH, {
		skip: value.length < 0,
		variables: { query: value, type },
		fetchPolicy: 'no-cache',
		onCompleted: setSearchData
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
			<Box ref={searchPageRef}>
				<Box background="dark-1" className={headerClass} direction="row" align="center" height="25vh">
					<BackButton color="light-1" history={history} />
					<Box width="100%" align="center" justify="center">
						<Text size="40px">Search</Text>
					</Box>
				</Box>
				<Box className="searchHeader">
					<Box direction="row" align="center" pad="medium">
						{headerClass && <BackButton position={headerClass ? 'relative' : 'absolute'} history={history} size="large" />}
						<Box className={headerClass ? `searchBox ${headerClass}` : 'searchBox'} direction="row" align="center">
							<Search className="appSearchIcon" />
							<TextInput
								ref={searchRef}
								className="appSearch"
								placeholder="Search for events,venues and cities"
								value={value}
								onChange={onSearch}
							/>
						</Box>
					</Box>
					<Box direction="row" className="searchFilterButtonBox">
						<Text>Filter By :</Text>
						<Box direction="row" justify="evenly">
							<FilterButton label="Event" setFilterCallback={setFilter} />
							<FilterButton label="Location" setFilterCallback={setFilter} />
							{/* TODO */}
							<FilterButton
								label="Venue"
								setFilterCallback={() => {
									console.log('test');
								}}
							/>
							<FilterButton
								label="Artist"
								setFilterCallback={() => {
									console.log('test');
								}}
							/>
						</Box>
					</Box>
				</Box>
				{value.length > 0 && data && !loading && (
					<>
						<Box pad="medium" className="eventList">
							{events.length === 0 && <Text weight="bold">No Events Found</Text>}
							{events.length > 0 &&
								events.map(event => <Event key={event.id} onClick={() => onClickEvent(event)} {...event} />)}
						</Box>
					</>
				)}
				{loading && (
					<Box pad="medium" className="skeletonEvent">
						<div class="post">
							<div class="avatar" />
							<div class="line" />
							<div class="line" />
							<div class="ticket" />
						</div>
						<div class="post">
							<div class="avatar" />
							<div class="line" />
							<div class="line" />
						</div>
						<div class="post">
							<div class="avatar" />
							<div class="line" />
							<div class="line" />
						</div>
					</Box>
				)}
			</Box>
		);
	}
}

export default SearchPage;
