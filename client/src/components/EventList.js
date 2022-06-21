import {useState, useEffect, React} from "react";

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
		<ul>
			{data.map(item => (
				<li key={item.id}>
					<h1>
						{item.id} {item.name}
					</h1>
					<p> {item.desc} </p>
				</li>
			))}
		</ul>
	);
};

export default EventList;
