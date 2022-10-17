import {useState, useEffect, React} from "react";

import EventToken from "./EventToken";

import style from "../style/EventList.module.scss";
import grey from "../assets/placeholders/grey.png";

import Event from "../pages/body/Event.js";

import {Placeholder, Title} from "react-bootstrap";

const EventList = param => {
	const [data, setData] = useState([]);
	const [ret, setRet] = useState(
		<div className={style.scroll_container_40vw}>
			<Placeholder as="h1" animation="glow">
				<Placeholder xs={6} />
			</Placeholder>
			<img src={grey} width="150px" />
			<Placeholder as="p" animation="glow">
				<Placeholder xs={6} />
			</Placeholder>
			<Placeholder as="h1" animation="glow">
				<Placeholder xs={6} />
			</Placeholder>
			<img src={grey} width="150px" />
			<Placeholder as="p" animation="glow">
				<Placeholder xs={6} />
			</Placeholder>
			<Placeholder as="h1" animation="glow">
				<Placeholder xs={6} />
			</Placeholder>
			<img src={grey} width="150px" />
			<Placeholder as="p" animation="glow">
				<Placeholder xs={6} />
			</Placeholder>
		</div>
	);
	const [popUpEvent, setPopUpEvent] = useState(-1);

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
				if (!actualData.length)
					setRet(
						<div>
							Pas d'évènements trouvés pour les filtres
							sélectionnés{" "}
						</div>
					);
				else setData(actualData);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [param.filter]);

	return (
		<>
			{param.showCount && (
				<p>
					{data.length}{" "}
					{data.length >= 2 ? <>résultats</> : <>résultat</>}
				</p>
			)}
			<div className={style.scroll_container_40vw}>
				{data.map(item => (
					<li key={item.id}>
						<EventToken
							setPopUpEvent={setPopUpEvent}
							event={item}
							type="event"
						/>
					</li>
				))}
			</div>
			{popUpEvent !== -1 && (
				<>
					<div id={style.filter}>
						<div
							id={style.outArea}
							onClick={() => {
								setPopUpEvent(-1);
							}}
						></div>
						<Event
							id={popUpEvent}
							closeEvent={() => {
								setPopUpEvent(-1);
							}}
						/>
					</div>
				</>
			)}
		</>
	);
};

export default EventList;
