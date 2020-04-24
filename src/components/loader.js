import Loader from 'react-loader-spinner';
import { Box, Text } from 'grommet';
import React from 'react';

function appLoader({ type = 'ThreeDots', text }) {
	return (
		<>
			<Box pad="med" width="100vw" height="100vh" justify="center" align="center">
				<Loader type={type} color="#7D4CDB" height="100" width="100" />
				<Text className="loaderText" weight="bold">
					{text}
				</Text>
			</Box>
		</>
	);
}

export default appLoader;
