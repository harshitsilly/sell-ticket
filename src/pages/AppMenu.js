import React from "react";
import { Button, Box, Text } from "grommet";
import { Next } from "grommet-icons";
import { Redirect } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Loader from "../components/loader";
const POST_MUTATION = gql`
  mutation {
    logout
  }
`;
function AppMenu({ userData }) {
  let [postMutation, { loading, error: mutationError }] = useMutation(
    POST_MUTATION,
    {
      onCompleted({ login }) {
        setRedirect(true);
      }
    }
  );
  const onPressLogout = postMutation;
  const [redirect, setRedirect] = React.useState(false);
  if (loading) return <Loader />;
  if (redirect) {
    return <Redirect push="true" to="/login" />;
  } else {
    return (
      <>
        <Box pad="medium">
          <Button
            primary
            className="sellTicket"
            color="status-ok"
            label="Sell Tickets"
            onClick={() => {}}
          />
          {!userData && (
            <Button
              reverse
              className="appMenuButton"
              icon={<Next />}
              label="Login"
              onClick={() => setRedirect(true)}
            />
          )}
          {userData && (
            <>
              <Text weight="bold" color="status-ok">
                Welcome {userData.firstName}
              </Text>
              <Button
                reverse
                className="appMenuButton"
                icon={<Next />}
                label="Logout"
                onClick={onPressLogout}
              />
            </>
          )}
          <Button
            reverse
            className="appMenuButton"
            icon={<Next />}
            label="How It Works"
            onClick={() => {}}
          />
          <Button
            reverse
            className="appMenuButton"
            icon={<Next />}
            label="Help"
            onClick={() => {}}
          />
        </Box>
      </>
    );
  }
}

export default AppMenu;
