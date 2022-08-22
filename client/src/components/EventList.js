import {useState, useEffect, React} from "react";

import EventToken from "./EventToken";

import style from "../style/EventList.module.css";

const EventList = param => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const requestOptions = {
			method: "post",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(param.filter)
		};
		fetch(`http://${global.config.api.authority}/event/get`, requestOptions)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(actualData => {
				setData(actualData);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [param.filter]);

	return data.length ? (
		<div className={style.scroll_container_40vw}>
			{data.map(item => (
				<li key={item.id}>
					<EventToken event={item} type="event" />
				</li>
			))}
		</div>
	) : (
		<div>No event for the moment ma boi</div>
	);
};

export default EventList;
