import React,{useEffect,useLayoutEffect} from 'react';
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
	query Events($category: String!,$first: Int,$skip: Int) {
		events(category: $category,first:$first,skip:$skip) {
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
	const [showMore, setShowMore] = React.useState(false);
	const [headerClass, setHeaderClass] = React.useState('positionSticky');
    const[firstSkip,setFirstSkip] = React.useState({first:7,skip:0})
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
	const showMoreRef = React.useRef();
	let loadEvents = () => {
		setFirstSkip({first:5,skip:firstSkip.first+ firstSkip.skip})
		
	};
	const [redirectToEventDetail, setRedirectToEventDetail] = React.useState('');
	let setEventsData = ()=>
	{
		data && setEvents(()=>[...events,...data.events]);
		if(data.events.length<5){
			setShowMore(false);
		}
		else{
			setShowMore(true);
		}
		
		
	}
	useLayoutEffect(() => {
		if(events.length>7 && showMoreRef.current){
		let showMoreTop = showMoreRef.current.offsetTop;
		window.scrollTo({ top: showMoreTop });	
		}
    
  }, [events]);
	const { loading, error, data } = useQuery(Events_Query, {
		variables: { category , first: firstSkip.first,skip:firstSkip.skip},
		fetchPolicy: 'no-cache',
		onCompleted : setEventsData
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
					
					{data && (
						<>
							<Box pad="medium" className="eventList">
								{events.length === 0 && <Text weight="bold">No Events Found</Text>}
								{events.length > 0 &&
									events.map(event => (
										<Event
											key={event.id}
											onClick={() => onClickEvent(event.name)}
											{...props}
											{...event}
										/>
									))}
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
									<ShowMore  onClick={loadEvents} />
								</Box>
							)}
				</Box>
			</>
		);
	}
}
export default Category;
