import React, { useLayoutEffect } from 'react';
import { Text, Box, TextInput, Button } from 'grommet';
import { Search, FormClose } from 'grommet-icons';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';
import Event from '../components/event';
import FilterButton from '../components/filterButton';
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

function SearchPage() {
	const [events, setEvents] = React.useState([]);
	const [value, setValue] = React.useState('');
	const [type, setType] = React.useState([]);
	const [redirectToEventDetail, setRedirectToEventDetail] = React.useState(false);
	const searchRef = React.createRef();
	let onClickEvent = event => {
		setRedirectToEventDetail(event);
	};
	useLayoutEffect(() => {
		searchRef.current && searchRef.current.focus();
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
		skip: value.length < 3,
		variables: { query: value, type },
		fetchPolicy: 'no-cache',
		onCompleted: setSearchData
	});
	if (value.length > 2) {
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
				<Box>
					<Box className="searchBox" direction="row" align="center" pad="medium">
						<Search className="appSearchIcon" />
						<TextInput
							className="appSearch"
							placeholder="Search for events,venues and cities"
							value={value}
							onChange={onSearch}
						/>
					</Box>
					<Box direction="row" className="searchFilterButtonBox">
						<Text>Filter By :</Text>
						<Box direction="row" justify="evenly">
							<FilterButton label="Event" setFilterCallback={setFilter}></FilterButton>
							<FilterButton label="Location" setFilterCallback={setFilter}></FilterButton>
							{/* TODO */}
							<FilterButton
								label="Venue"
								setFilterCallback={() => {
									console.log('test');
								}}
							></FilterButton>
						</Box>
					</Box>
					{data && !loading && (
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
			);
		}
	} else {
		return (
			<Box height="100vh">
				<Box className="searchBox" direction="row" align="center" pad="medium">
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
		);
	}
}

export default SearchPage;
