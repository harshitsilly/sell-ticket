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

function AreaPage({ history }) {
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
		skip: value.length < 3,
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
					<Box width="100%" align="center" justify="center">
						<Text size="40px">In Your Area</Text>
					</Box>
				</Box>
				<Box background="dark-1" className={headerClass} direction="row" align="center" height="25vh">
					<Box width="100%" align="center" justify="center">
						<Text size="40px">Upcoming Events</Text>
					</Box>
				</Box>
				<div style={{ width: '50vmin', height: '400', paddingBottom: '74%', position: 'relative' }}>
					<img src="https://media.giphy.com/media/sXgNCQ6qvKVm8/source.gif" width="100%" height="100%" alt=""></img>
				</div>

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
}

export default AreaPage;
