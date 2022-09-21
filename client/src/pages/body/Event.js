import {useState, useEffect, React} from "react";
import {useParams} from "react-router-dom";
import {Button} from "react-bootstrap";
import {Card, CardBody, CardTitle, CardSubtitle, CardText} from "reactstrap";
import EventAlbum from "../../components/EventAlbum";
import {NotificationManager} from "react-notifications";

const Event = () => {
	const [update, setUpdate] = useState(false);
	const [dataEvent, setDataEvent] = useState([]);
	const [dataInsc, setDataInsc] = useState([]);
	const [dataStud, setDataStud] = useState([]);
	const [button, setButton] = useState(<> </>);
	const [duration, setDuration] = useState("Never Ending Fun");
	const [thumbnail, setThumnail] = useState(null);
	const [locked, setLocked] = useState(false);
	const param = useParams();

	// thumbnail
	useEffect(() => {
		setUpdate(false);
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
	}, [param.id, update]);

	// event info
	useEffect(() => {
		setUpdate(false);
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
					`This is a fetch error: The error is ${error.message}. gotta go back`
				);
				window.location = "/events";
			})
			.then(() => {
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
			});
	}, [param.id, update]);

	//is subbded
	useEffect(() => {
		const unsub = async () => {
			setLocked(true);
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
			setLocked(false);
			setUpdate(true);
		};

		const sub = async () => {
			setLocked(true);

			await fetch(
				`http://${global.config.api.authority}/inscription/me/${param.id}`,
				{
					method: "POST",
					credentials: "include"
				}
			)
				.then(response => {
					if (!response.ok) {
						NotificationManager.warning(
							"Nique ta mere cest full",
							"Attention",
							3000
						);
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
			setLocked(false);
			setUpdate(true);
		};
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
					setButton(
						<Button onClick={unsub} disabled={locked}>
							Unsubscribe
						</Button>
					);
				else
					setButton(
						<Button onClick={sub} disabled={locked}>
							Subscribe
						</Button>
					);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, [update, locked, param]);

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/stud/minecraft/`, {
			method: "GET",
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
			.then(data => {
				console.log(data);
				setDataStud(data);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, [update]);

	if (dataEvent.length === 0) return <></>;
	return (
		<>
			<Card
				style={{
					width: "18rem"
				}}
			>
				<img
					src={thumbnail}
					height="auto"
					width="auto"
					alt={`Thumbnail of event ${param.id}`}
				/>
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
							? `Places : ${dataInsc.length}
							/ ${dataEvent.nb_places - dataStud.isPremium ? 0 : dataEvent.nb_premium_places}`
							: `Places : ${dataInsc.length} / ∞`}
					</CardSubtitle>
					<CardSubtitle className="mb-2 text-muted" tag="h6">
						{`Lieu : ${dataEvent.place}`}
					</CardSubtitle>
					<CardSubtitle className="mb-2 text-muted" tag="h6">
						{dataEvent.cost !== 0
							? dataEvent.premium_cost === dataEvent.cost
								? `Prix : ${dataEvent.cost}€`
								: `Prix publique : ${dataEvent.cost}€
								/ Adhérent : ${dataEvent.premium_cost}€`
							: `Gratuit !`}
					</CardSubtitle>
					<CardSubtitle className="mb-2 text-muted" tag="h6">
						{`Durée : ${duration}`}
					</CardSubtitle>
					<CardText>{dataEvent.desc}</CardText>
					{button}
				</CardBody>
			</Card>
			<EventAlbum id={param.id} />
		</>
	);
};
export default Event;
