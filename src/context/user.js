import React, { createContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Loader from '../components/loader';
const UserContext = createContext();
const CURRENT_USER = gql`
	# Write your query or mutation here
	{
		currentUser {
			id
			firstName
			lastName
			email
		}
	}
`;

const CURRENT_USER2 = gql`
	# Write your query or mutation here
	{
		currentUser {
			id
			firstName
			lastName
			email
		}
	}
	{
		__type(name: "CategoryFormat") {
			name
			enumValues {
				name
			}
		}
	}
	{
		events(category: Sports) {
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

const UserProvider = ({ children }) => {
	// const { loading, error, data } = useQuery(CURRENT_USER, {
	// 	fetchPolicy: 'no-cache'
	// });
	// if (loading) return <Loader />;
	// if (error) return `Error! ${error.message}`;
	let data ={currentUser:null}
	return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

export { UserProvider, UserContext };
