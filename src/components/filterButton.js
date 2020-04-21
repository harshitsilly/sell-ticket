import { Button } from 'grommet';
import { FormClose } from 'grommet-icons';
import React from 'react';

function FilterButton({ label, setFilterCallback }) {
	const [filter, setFilter] = React.useState(false);
	let onClickFilterButton = () => {
		setFilter(!filter);
		setFilterCallback(label, !filter);
	};
	return (
		<>
			<Button
				primary
				label={label}
				reverse="true"
				onClick={onClickFilterButton}
				icon={<FormClose className={!filter ? 'displayNoneIcon' : ''} />}
			></Button>
		</>
	);
}

export default FilterButton;
