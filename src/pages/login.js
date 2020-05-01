import React, { useContext, useLayoutEffect } from 'react';
import { Button, Box, Form, FormField, Text, TextInput } from 'grommet';
import { User, License, Twitter, FacebookOption, Google } from 'grommet-icons';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Redirect, useHistory } from 'react-router-dom';
import Loader from '../components/loader';
import { UserContext } from '../context/user';

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
function Login() {
	const { setUserData } = useContext(UserContext);
	const loginBoxRef = React.createRef(null);
	useLayoutEffect(() => {
		loginBoxRef.current && (loginBoxRef.current.style.height = window.innerHeight + 'px');
	});
	let [postMutation, { loading, error: mutationError }] = useMutation(POST_MUTATION, {
		onCompleted({ login }) {
			setRedirectToPage(true);
			setUserData({ currentUser: login.user });
		}
	});
	const onPressSubmitPasswordForm = event => {
		postMutation({ variables: { ...event.value } });
	};
	const [redirectToSignUp, setRedirectToSignUp] = React.useState(false);
	const [redirectToPage, setRedirectToPage] = React.useState(false);
	if (loading) return <Loader />;
	if (redirectToSignUp) {
		return <Redirect push="true" to="/signup" />;
	} else if (redirectToPage) {
		return <Redirect to="/" />;
	} else {
		return (
			<>
				<Box ref={loginBoxRef} className="loginPage" pad="medium" justify="between">
					<Box>
						{/* <FormPreviousLink /> */}
						<Box className="loginText" align="center" justify="between" direction="row">
							<Box>
								<Text color="dark-1">Welcome Back</Text>
							</Box>

							<Box align="center" className="circleBox" direction="row">
								<div class="circleSmall"></div>
								<div class="circle"></div>
							</Box>
						</Box>
						<Box className="siginAppLogo" align="center" justify="center">
							<img className="appLogoHeader" src="logo/logo_black.png" alt="" />
						</Box>
						<Form onSubmit={onPressSubmitPasswordForm}>
							<Box className="loginForm" pad="large" gap="small">
								<FormField
									name="email"
									required
									component={props => (
										<Box direction="row" align="center">
											<User />
											<TextInput type="email" {...props} placeholder="Email"></TextInput>
										</Box>
									)}
								/>
								<FormField
									name="password"
									required
									component={props => (
										<Box direction="row" align="center">
											<License className="licenseTransformScale" />
											<TextInput type="password" {...props} placeholder="Password"></TextInput>
										</Box>
									)}
								/>
							</Box>
							<Box direction="row" width="100%" pad="small" justify="between">
								<Button className="forgetPasswordButton" plain color="dark-1" label="Forget Password?" />
								<Button className="signInButton" color="#8B16FF" type="submit" primary label="LOGIN" />
							</Box>
						</Form>
					</Box>
					{mutationError && <p>Error :( Please try again</p>}
					<Box direction="row" pad="small" gap="medium" justify="between" align="center">
						<Box>Or Login with</Box>
						<Button
							plain
							icon={<Twitter color="#22A1F1" />}
							onClick={() => {
								window.location = '/auth/google';
							}}
						/>
						<Button
							plain
							icon={<FacebookOption color="#3C5A97" />}
							onClick={() => {
								window.location = '/auth/google';
							}}
						/>
						<Button
							plain
							icon={<Google color="#EA4537" />}
							onClick={() => {
								window.location = '/auth/google';
							}}
						/>
					</Box>

					<Box pad="small" direction="row" justify="between">
						<Box align="center" className="circleBoxSignup" direction="row-reverse">
							<div class="circleSmall"></div>
							<div class="circle"></div>
						</Box>
						<Button
							className="signUpButtonOnLoginScreen"
							plain
							color="dark-1"
							label="SignUp"
							onClick={() => setRedirectToSignUp(true)}
						/>
					</Box>
				</Box>
			</>
		);
	}
}

export default Login;
