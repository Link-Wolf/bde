import {useState, useEffect, React} from "react";

import EventToken from "./EventToken";

import style from "../style/EventList.module.css";
import grey from "../assets/placeholders/grey.png";

import {Placeholder, Title} from "react-bootstrap";

const EventList = param => {
	const [data, setData] = useState([]);
	const [ret, setRet] = useState(
		<div className={style.scroll_container_40vw}>
			<br />
			<Placeholder as="h1" animation="glow">
				<Placeholder xs={6} />
			</Placeholder>
			<img src={grey} width="150px" />
			<Placeholder as="p" animation="glow">
				<Placeholder xs={6} />
			</Placeholder>
		</div>
	);

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
					setRet(<div>No event for the moment ma boi</div>);
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

	useEffect(() => {
		setRet(
			<div className={style.scroll_container_40vw}>
				{data.map(item => (
					<li key={item.id}>
						<EventToken event={item} type="event" />
					</li>
				))}
			</div>
		);
	}, [data]);

	return ret;
};

export default EventList;
