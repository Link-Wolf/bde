import {useState, useEffect, React} from "react";
import {useParams} from "react-router-dom";
import NoPage from "./NoPage";
import {Button} from "react-bootstrap";
import {Card, CardBody, CardTitle, CardSubtitle, CardText} from "reactstrap";
import EventAlbum from "../../components/EventAlbum";
const Event = () => {
	const [update, setUpdate] = useState(false);
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
	}, [param.id]);

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

	const unsub = async () => {
		await fetch(
			`http://${global.config.api.authority}/inscription/minecraft/${param.id}`,
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
		setUpdate(true);
	};

	const sub = async () => {
		await fetch(
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
		setUpdate(true);
	};

	useEffect(() => {
		setUpdate(false);
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
	}, [update]);

	return dataEvent.name ? (
		<>
			<Card
				style={{
					width: "18rem"
				}}
			>
				<img src={thumbnail} />
				<CardBody>
					<CardTitle tag="h5"> {dataEvent.name}</CardTitle>
					<CardSubtitle className="mb-2 text-muted" tag="h6">
						{`Le ${new Date(
							dataEvent.begin_date
						).toLocaleDateString()} à
						${new Date(dataEvent.begin_date).toLocaleTimeString()}`}
					</CardSubtitle>
					<CardSubtitle className="mb-2 text-muted" tag="h6">
						{dataEvent.nb_places !== -42
							? `Places : ${dataInsc.length} / ${dataEvent.nb_places}`
							: `Places : ${dataInsc.length} / ∞`}
					</CardSubtitle>
					<CardSubtitle className="mb-2 text-muted" tag="h6">
						{`Lieu : ${dataEvent.place}`}
					</CardSubtitle>
					<CardSubtitle className="mb-2 text-muted" tag="h6">
						{dataEvent.cost !== 0
							? dataEvent.premium_cost === dataEvent.cost
								? `Prix : ${dataEvent.cost}€`
								: `Prix publique : ${dataEvent.cost}€ / Adhérent : ${dataEvent.premium_cost}€`
							: `Gratuit !`}
					</CardSubtitle>
					<CardSubtitle className="mb-2 text-muted" tag="h6">
						{`Durée : ${duration}`}
					</CardSubtitle>
					<CardText>{dataEvent.desc}</CardText>
					{dataEvent.end_date &&
					new Date(dataEvent.end_date) > new Date(Date.now()) ? (
						<>{button}</>
					) : (
						<></>
					)}
				</CardBody>
			</Card>
			<EventAlbum id={param.id} />
		</>
	) : (
		<NoPage /> // TODO: redirect events
	);
};
export default Event;
