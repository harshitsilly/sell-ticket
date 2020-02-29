import React from "react";
import { Button, Box, Form, FormField, Text, Footer } from "grommet";
import { Next } from "grommet-icons";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Redirect } from "react-router-dom";

function Signup() {
  const POST_MUTATION = gql`
    mutation Signup(
      $firstName: String!
      $lastName: String!
      $email: String!
      $password: String!
    ) {
      signup(
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
      ) {
        user {
          id
          firstName
          lastName
          email
        }
      }
    }
  `;
  let [postMutation, { error: mutationError }] = useMutation(POST_MUTATION, {
    onCompleted({ login }) {
      setRedirectToApp(true);
    }
  });
  const onPressSubmitPasswordForm = event => {
    postMutation({ variables: { ...event.value } });
  };

  const [redirectToApp, setRedirectToApp] = React.useState(false);
  if (redirectToApp) {
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
            <FormField name="firstName" label="First Name" />
            <FormField name="lastName" label="Last Name" />
            <FormField name="email" label="Email" />
            <FormField name="password" label="Password" />
            <FormField name="verifypassword" label="Verify Password" />
            <Box width="100%" pad="small">
              <Button type="submit" primary label="SignUp" />
            </Box>
          </Form>

          {mutationError && <p>Error :( Please try again</p>}
        </Box>
      </>
    );
  }
}

export default Signup;
