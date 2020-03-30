import React, { createContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Loader from "../components/loader";
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

const UserProvider = ({ children }) => {
  const { loading, error, data } = useQuery(CURRENT_USER, {
    fetchPolicy: "no-cache"
  });
  if (loading) return <Loader />;
  if (error) return `Error! ${error.message}`;

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

export { UserProvider, UserContext };
