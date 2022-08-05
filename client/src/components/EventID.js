import {useState, useEffect, React} from "react";
import {useParams} from "react-router-dom";
import NoPage from "../pages/body/NoPage";

import style from "../style/EventID.module.css";

const EventID = () => {
	const [dataEvent, setDataEvent] = useState([]);
	const [dataInsc, setDataInsc] = useState([]);
	const param = useParams();

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/event/${param.id}`, {
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(actualData => {
				setDataEvent(actualData);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
		fetch(
			`http://${global.config.api.authority}/inscription/event/${param.id}`,
			{
				credentials: "include"
			}
		)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(actualData => {
				setDataInsc(actualData);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, [param.id]);
	return dataEvent.name ? (
		<div
			className={`
				${style.box_light_copper}
				${style.middlespace}
				${"flex"}
				`}
		>
			<div>
				<div className={`${style.title_conta} ${"flex"}`}>
					<div className={`${style.box_dark_copper} ${style.name}`}>
						{dataEvent.name}
					</div>
					<div className={`${style.box_dark_copper} ${style.date}`}>
						{`Le ${new Date(
							dataEvent.begin_date
						).toLocaleDateString()} à
							${new Date(dataEvent.begin_date).toLocaleTimeString()}`}
					</div>
				</div>
				<div>
					<div className={style.box_med_copper}>{dataEvent.desc}</div>
				</div>
			</div>
			<div className={`${style.col_flex} ${style.middlespace} ${"flex"}`}>
				<div>
					<div className={style.box_dark_green}>
						{dataEvent.nb_places !== -42
							? `${dataInsc.length} / ${dataEvent.nb_places}`
							: `${dataInsc.length} / ∞`}
					</div>
					<div className={style.box_dark_green}>
						{dataEvent.place}
					</div>
					<div className={`${style.box_dark_green} ${style.price}`}>
						{dataEvent.cost !== 0
							? dataEvent.premium_cost === dataEvent.cost
								? `Prix : ${dataEvent.cost}€`
								: `Prix publique : ${dataEvent.cost}€\nPrix premium : ${dataEvent.premium_cost}€`
							: `Gratuit !`}
					</div>
					<div className={style.box_dark_green}>
						{dataEvent.end_date
							? new Date(
									new Date(dataEvent.end_date) -
										new Date(dataEvent.begin_date)
							  ).getHours()
							: "Never Ending Fun"}
					</div>
				</div>
				<div>
					<button className={style.button}>
						{" "}
						Subscribe / Unsubscribe (TODO){" "}
					</button>
				</div>
			</div>
		</div>
	) : (
		<NoPage />
	);
};
export default EventID;
