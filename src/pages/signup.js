import React from 'react';
import { Button, Box, Form, FormField, Text, TextInput } from 'grommet';
import { User, MailOption, License } from 'grommet-icons';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Redirect } from 'react-router-dom';

function Signup() {
	const POST_MUTATION = gql`
		mutation Signup($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
			signup(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
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
	const [redirectToLogin, setRedirectToLogin] = React.useState(false);
	const [redirectToApp, setRedirectToApp] = React.useState(false);
	if (redirectToApp) {
		return <Redirect to="/" />;
	} else if (redirectToLogin) {
		return <Redirect to="/login" />;
	} else {
		return (
			<>
				<Box className="loginPage" pad="medium" height="100%" justify="between">
					<Box className="loginText signupNoPad" align="center" justify="between" direction="row">
						<Box>
							<Text color="dark-1">Get On Board</Text>
						</Box>

						<Box align="center" className="circleBox" direction="row">
							<div class="circleSmall"></div>
							<div class="circle"></div>
						</Box>
					</Box>

					<Form onSubmit={onPressSubmitPasswordForm}>
						<Box className="loginForm" pad="large" gap="small">
							<Box direction="row">
								<FormField
									name="firstName"
									required
									component={props => (
										<Box direction="row" align="center">
											<User />
											<TextInput {...props} placeholder="First Name"></TextInput>
										</Box>
									)}
								/>
								<FormField
									name="lastName"
									required
									component={props => (
										<Box direction="row" align="center">
											<TextInput {...props} placeholder="Last Name"></TextInput>
										</Box>
									)}
								/>
							</Box>

							<FormField
								name="email"
								required
								component={props => (
									<Box direction="row" align="center">
										<MailOption />
										<TextInput type="email" {...props} placeholder="Email"></TextInput>
									</Box>
								)}
							/>
							<FormField
								name="password"
								required
								validate={[
									name => {
										if (name && name.length < 8)
											return { message: "That's short. Password should be atleast 8 chars long", status: 'error' };
										return undefined;
									}
								]}
								component={props => (
									<Box direction="row" align="center">
										<License className="licenseTransformScale" />
										<TextInput type="password" {...props} placeholder="Password"></TextInput>
									</Box>
								)}
							/>
							<FormField
								name="verifypassword"
								required
								validate={[
									(name, signUpObject) => {
										if (signUpObject.verifypassword !== signUpObject.password) {
											return { message: 'Verify Password does not match', status: 'error' };
										}
										return undefined;
									}
								]}
								component={props => (
									<Box direction="row" align="center">
										<License className="licenseTransformScale" />
										<TextInput type="password" {...props} placeholder="Verify Password"></TextInput>
									</Box>
								)}
							/>
						</Box>
						<Box direction="row" width="100%" pad="small" justify="between">
							<Button
								className="forgetPasswordButton"
								plain
								color="dark-1"
								label="Already have a account?"
								onClick={() => setRedirectToLogin(true)}
							/>
							<Button className="signInButton" color="#8B16FF" type="submit" primary label="Signup" />
						</Box>
					</Form>

					{mutationError && <p>Error :( Please try again</p>}
					<Box pad="small" direction="row" justify="between">
						<Box align="center" className="circleBoxSignup" direction="row-reverse">
							<div class="circleSmall"></div>
							<div class="circle"></div>
						</Box>
					</Box>
				</Box>
			</>
		);
	}
}

export default Signup;
