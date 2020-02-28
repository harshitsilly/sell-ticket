import React from "react";
import { Button, Box, Form, FormField, Text, Footer } from "grommet";
import { Google } from "grommet-icons";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Redirect } from "react-router-dom";
import Loader from "../components/loader";

function Login() {
  const POST_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        user {
          id
          firstName
          lastName
          email
        }
      }
    }
  `;
  let [postMutation, { loading, error: mutationError }] = useMutation(
    POST_MUTATION,
    {
      onCompleted({ login }) {
        setRedirectToApp(true);
      }
    }
  );
  const onPressSubmitPasswordForm = event => {
    postMutation({ variables: { ...event.value } });
  };
  const [redirectToSignUp, setRedirectToSignUp] = React.useState(false);
  const [redirectToApp, setRedirectToApp] = React.useState(false);
  if (loading) return <Loader />;
  if (redirectToSignUp) {
    return <Redirect push="true" to="/signup" />;
  } else if (redirectToApp) {
    return <Redirect to="/" />;
  } else {
    return (
      <>
        <Box pad="large" height="100vh">
          <Box pad="xlarge" align="center">
            <Text size="xlarge" weight="bold" color="brand">
              Sell Ticket
            </Text>
          </Box>

          <Form onSubmit={onPressSubmitPasswordForm}>
            <FormField name="email" label="Email" />
            <FormField name="password" label="Password" />
            <Button type="submit" primary label="SignIn" />
          </Form>

          {mutationError && <p>Error :( Please try again</p>}
          <Box pad="small">
            <Button
              primary
              icon={<Google />}
              label="Login"
              color="status-critical"
              onClick={() => {
                window.location = "/auth/google";
              }}
            />
          </Box>

          <Box pad="small" direction="row" justify="between">
            <Button
              plain
              color="brand"
              label="SignUp"
              onClick={() => setRedirectToSignUp(true)}
            />

            <Button plain color="brand" label="Forgot Password" />
          </Box>
        </Box>
      </>
    );
  }
}

export default Login;
