import { Button } from 'grommet';
import { FormPreviousLink } from 'grommet-icons';
import React from 'react';

function BackButton({ history, position, ...iconProps }) {
	let onClickBackButton = () => {
		history.goBack();
	};
	return (
		<>
			<Button
				plain
				className={`backButton ${position}`}
				onClick={onClickBackButton}
				icon={<FormPreviousLink {...iconProps} />}
			></Button>
		</>
	);
}

export default BackButton;
