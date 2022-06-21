import {useState, useEffect, React} from "react";

const EventList = () => {
	const [dataEvent, setDataEvent] = useState([]);
	const [dataInsc, setDataInsc] = useState([]);

	useEffect(() => {
		fetch(`http://localhost:4242/event/:id`)
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
				setDataEvent(actualData);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
		fetch(`http://localhost:4242/inscription/event/:id`)
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
				setDataInsc(actualData);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, []);
	return (
		<div>
			<div>
				<div>
					<h2>{dataEvent.name}</h2>
					<h3>{dataEvent.begin_date}</h3>
				</div>
				<p>{dataEvent.desc}</p>
			</div>
			<div>
				<p>
					{dataEvent.nb_places == -42
						? `${dataInsc.length} / ${dataEvent.nb_places}`
						: `${dataInsc.length} / ∞`}
				</p>
				<p>{dataEvent.place}</p>
				<p>
					{dataEvent.cost != 0
						? dataEvent.premium_cost == dataEvent.cost
							? `Prix : ${dataEvent.cost}€`
							: `Prix publique : ${dataEvent.cost}€<br/>Prix premium : ${dataEvent.premium_cost}Prix : ${dataEvent.premium_cost}€`
						: `Gratuit !`}
				</p>
				<p>{dataEvent.end_date - dataEvent.begin_date}</p>
				<button> Subscribe / Unsubscribe (TODO) </button>
			</div>
		</div>
	);
};
export default EventList;
