import React, { createContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Loader from '../components/loader';
const UserContext = createContext({
	userData: { currentUser: null }
});
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
	const [userData, setUserData] = React.useState({ currentUser: null });

	const { loading, error, data } = useQuery(CURRENT_USER, {
		fetchPolicy: 'no-cache',
		onCompleted: () => {
			setUserData(data);
		}
	});
	if (loading) return <Loader />;
	if (error) return `Error! ${error.message}`;

	return <UserContext.Provider value={{ userData, setUserData }}>{children}</UserContext.Provider>;
};

export { UserProvider, UserContext };
