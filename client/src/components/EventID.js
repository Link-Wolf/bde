import {useState, useEffect, React} from "react";
import {useParams} from "react-router-dom";
import NoPage from "../pages/body/NoPage";
import {Button} from "react-bootstrap";

import style from "../style/EventID.module.css";

const EventID = () => {
	const [dataEvent, setDataEvent] = useState([]);
	const [dataInsc, setDataInsc] = useState([]);
	const [button, setButton] = useState(<> </>);
	const [duration, setDuration] = useState("Never Ending Fun");
	const [thumbnail, setThumnail] = useState(null);
	const param = useParams();

	useEffect(() => {
		fetch(
			`http://${global.config.api.authority}/event/${param.id}/thumbnail`,
			{
				credentials: "include"
			}
		)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is` +
							` ${response.status}`
					);
				}
				return response.blob();
			})
			.then(blob => {
				setThumnail(URL.createObjectURL(blob));
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, []);

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
				if (actualData.end_date) {
					const span =
						new Date(actualData.end_date) -
						new Date(actualData.begin_date);
					const span_hour = span / 1000 / 60 / 60;
					const span_days = span_hour / 24;
					if (span_hour >= 24) setDuration(`${span_days} jour(s)`);
					else setDuration(`${span_hour} heure(s)`);
				}
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

	const unsub = () => {
		fetch(
			`http://${global.config.api.authority}/inscription/me/${param.id}`,
			{
				method: "DELETE",
				credentials: "include"
			}
		)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	};

	const sub = () => {
		fetch(
			`http://${global.config.api.authority}/inscription/me/${param.id}`,
			{
				method: "POST",
				credentials: "include"
			}
		)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	};

	useEffect(() => {
		fetch(
			`http://${global.config.api.authority}/inscription/${param.id}/isSubbed`,
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
			.then(data => {
				if (data.isSubbed)
					setButton(<Button onClick={unsub}> Unsubscribe </Button>);
				else setButton(<Button onClick={sub}> Subscribe </Button>);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, []);

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
				<div>
					<img className={style.box_med_copper} src={thumbnail} />
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
					<div className={style.box_dark_green}>{duration}</div>
				</div>
				<div> {button} </div>
			</div>
		</div>
	) : (
		<NoPage />
	);
};
export default EventID;
