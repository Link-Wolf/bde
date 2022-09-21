import {useState, useEffect, React} from "react";
import {useParams} from "react-router-dom";
import {Button} from "react-bootstrap";
import {Card, CardBody, CardTitle, CardSubtitle, CardText} from "reactstrap";
import EventAlbum from "../../components/EventAlbum";
import {NotificationManager} from "react-notifications";
import useConfirm from "../../components/useConfirm";
const Event = () => {
	const [update, setUpdate] = useState(false);
	const {isConfirmed} = useConfirm();
	const [dataEvent, setDataEvent] = useState([]);
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

		const callBdeSub = async () => {
			setLocked(true);
			await isConfirmed(
				`Contacte un membre du BDE pour payer et valider ton inscription !`
			);
			setLocked(false);
		};

		const callBdeUnsub = async () => {
			setLocked(true);
			await isConfirmed(
				`Contacte un membre du BDE pour te faire rembourser et retirer ton inscription !`
			);
			setLocked(false);
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
					if (
						(dataEvent.premium_cost == 0 && data.isPremium) ||
						dataEvent.cost == 0
					)
						setButton(
							<Button onClick={unsub} disabled={locked}>
								Unsubscribe
							</Button>
						);
					else
						setButton(
							<Button onClick={callBdeUnsub} disable={locked}>
								Unsubscribe
							</Button>
						);
				else if (
					(dataEvent.premium_cost == 0 && data.isPremium) ||
					dataEvent.cost == 0
				)
					setButton(
						<Button onClick={sub} disabled={locked}>
							Subscribe
						</Button>
					);
				else
					setButton(
						<Button onClick={callBdeSub} disable={locked}>
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

	// stud info
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
				setDataStud(data);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, [update]);
	console.log(dataEvent);
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
						{dataEvent.nb_places === -42 ? (
							`Places : ${dataEvent.subbed} / ∞`
						) : 0 === dataEvent.nb_premium_places ||
						  dataStud.isPremium ? (
							`Places : ${dataEvent.subbed} / ${dataEvent.nb_places}`
						) : (
							<>
								{`Places : ${dataEvent.subbed -
									dataEvent.premium_subbed} / ${dataEvent.nb_places -
									dataEvent.nb_premium_places}`}
								<div>
									Dont {dataEvent.nb_premium_places} places
									reservées aux membres{" "}
									<a href="/contribute">premiums</a>
								</div>
							</>
						)}
					</CardSubtitle>
					<CardSubtitle className="mb-2 text-muted" tag="h6">
						{`Lieu : ${dataEvent.place}`}
					</CardSubtitle>
					<CardSubtitle className="mb-2 text-muted" tag="h6">
						{dataEvent.cost === 0 ? (
							`Gratuit !`
						) : dataEvent.premium_cost === dataEvent.cost ||
						  dataStud.isPremium ? (
							`Prix : ${dataEvent.premium_cost}€`
						) : (
							<>
								{`Prix : ${dataEvent.cost}€`}
								<div>
									Ou {dataEvent.premium_cost}
									{"€ "}
									pour les membres{" "}
									<a href="/contribute">premiums</a>
								</div>
							</>
						)}
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
