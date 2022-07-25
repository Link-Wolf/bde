import {useState, useEffect, React} from "react";

import style from "../style/EventList.module.css";

const EventList = param => {
	const [data, setData] = useState([]);
	const [token, setToken] = useState("");

	useEffect(() => {
	// TODO: fetch token
	}, []);

	useEffect(() => {
		const requestOptions = {
			method: "post",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`
			}, //add security token here i guess
			body: JSON.stringify(param.filter)
		};
		fetch(`http://localhost:4242/event/get`, requestOptions)
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
	}, [param.filter, token]);

	return data.length ? (
		<div className={style.scroll_container_40vw}>
			{data.map(item => (
				<li key={item.id}>
					<h1>
						<a href={`/event/${item.id}`}>
							{item.id} {item.name}
						</a>
					</h1>
					<p> {item.desc} </p>
				</li>
			))}
		</div>
	) : (
		<div>No event for the moment ma boi</div>
	);
};

export default EventList;
