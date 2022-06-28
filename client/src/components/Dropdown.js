import {useState} from "react";

const Dropdown = param => {
	const [deployed, setDeployed] = useState(false);

	const handleButton = () => {
		setDeployed(!deployed);
	};

	let content = <div> {param.children} </div>;
	if (!deployed) content = "";

	return (
		<>
			<button id={param.id} onClick={handleButton}>
				{param.title}
			</button>
			{content}
		</>
	);
};

export default Dropdown;
