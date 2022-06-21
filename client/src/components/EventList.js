import {useState, useEffect, React} from "react";

import "../style/EventList.css";

const EventList = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		fetch(`http://localhost:4242/event/current`)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(actualData => {
				console.log(actualData);
				setData(actualData);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, []);
	return (
		<div className="scroll_container_40vw">
			{data.map(item => (
				<li key={item.id}>
					<h1>
						{item.id} {item.name}
					</h1>
					<p> {item.desc} </p>
				</li>
			))}
		</div>
	);
};

export default EventList;
