import {useState, useEffect, React} from "react";
import {NotificationManager} from "react-notifications";
import useConfirm from "../../components/useConfirm";
import b64ToBlob from "b64-to-blob";
import jszip from "jszip";

import style from "../../style/Event.module.scss";

import durationLogo from "../../assets/logos/time.svg";
import locationLogo from "../../assets/logos/location.svg";
import nbPlacesLogo from "../../assets/logos/places.svg";
import inscCostLogo from "../../assets/logos/price.svg";
import dateTimeLogo from "../../assets/logos/date.svg";
import isOutsideLogo from "../../assets/logos/outside.svg";
import conso from "../../assets/logos/consos.svg";
import sponso from "../../assets/logos/sponso.svg";
import pool from "../../assets/logos/pool.svg";
import fadedConso from "../../assets/logos/fadedConsos.svg";
import fadedSponso from "../../assets/logos/fadedSponso.svg";
import fadedPool from "../../assets/logos/fadedPool.svg";

const Event = param => {
	const [dataEvent, setDataEvent] = useState([]);
	const [duration, setDuration] = useState("Never Ending Fun");
	const [isPremium, setIsPremium] = useState(undefined);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/event/${param.id}`, {
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error:
						The status is ${response.status}`
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
					`This is a fetch error: The error is ${error.message}.`
				);
				window.location = "/events";
			});
	}, [param.id]);

	return (
		<div className={style.eventContainer}>
			<div className={style.headerEvent}>
				<Thumbnail id={param.id} />
				<div className={style.titleHeader}>
					<Title dataEvent={dataEvent} />
					<DateDuration dataEvent={dataEvent} duration={duration} />
				</div>
			</div>
			<div className={style.bodyEvent}>
				<Details duration={duration} dataEvent={dataEvent} />
				<div>
					<div>
						<hr id={style.niktameredegagedemapagegrossemerde} />

						<Description dataEvent={dataEvent} />
						<hr />
					</div>
					<div>
						<Price dataEvent={dataEvent} isPremium={isPremium} />
						<SubscribeButton
							closeEvent={param.closeEvent}
							dataEvent={dataEvent}
							setIsPremium={setIsPremium}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

const Thumbnail = param => {
	const [thumbnail, setThumnail] = useState(null);

	useEffect(() => {
		if (param.id === undefined || param.id === "" || !param.id) return;
		fetch(`${process.env.REACT_APP_API_URL}/event/${param.id}/thumbnail`, {
			credentials: "include"
		})
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

	return (
		<div className={style.thumbnail}>
			<img src={thumbnail} />
		</div>
	);
};

const Description = param => {
	return <p>{param.dataEvent.desc}</p>;
};

const Title = param => {
	return <h1>{param.dataEvent.name}</h1>;
};

const DateDuration = param => {
	if (!param.dataEvent.begin_date) return;
	return (
		<div>
			<div>
				<img src={dateTimeLogo} />
				{new Intl.DateTimeFormat("fr-FR", {
					day: "numeric",
					month: "short",
					year: "numeric",
					hour: "2-digit",
					minute: "2-digit"
				}).format(new Date(param.dataEvent.begin_date))}
			</div>
			<div>
				<img src={durationLogo} />
				{param.duration}
			</div>
		</div>
	);
};

const Price = param => {
	return (
		<>
			<div className={style.price}>
				<div />
				{!param.isPremium && (
					<a>
						<div>
							Classique
							<img src={inscCostLogo} />
						</div>
						{param.dataEvent.cost},00
					</a>
				)}
				{(param.isPremium || param.dataEvent.cost !== 0) && (
					<a
						className={!param.isPremium ? style.no : style.yes}
						href="/purchase"
					>
						<div>
							Prilivège
							<img src={inscCostLogo} />
						</div>

						{param.dataEvent.premium_cost !== 0
							? param.dataEvent.premium_cost
							: "Gratuit"}
					</a>
				)}
				<div />
			</div>
		</>
	);
};

const Details = param => {
	return (
		<ul>
			<li>
				<img src={nbPlacesLogo} />
				<br />
				{param.dataEvent.subbed} /{" "}
				{param.dataEvent.nb_places === -42 ? (
					<>∞</>
				) : (
					param.dataEvent.nb_places
				)}
			</li>
			<li>
				<img src={locationLogo} />
				<br />
				{param.dataEvent.place}
			</li>
			<li>
				<img src={isOutsideLogo} />
				<br />
				{param.dataEvent.isOutside ? "Dehors" : "À l'école"}
			</li>
			<li>
				<img src={param.dataEvent.consos ? conso : fadedConso} />
				<br />
				{param.dataEvent.consos ? "Consommations" : ""}
			</li>
			<li>
				<img src={param.dataEvent.for_pool ? pool : fadedPool} />
				<br />
				{param.dataEvent.for_pool ? "Piscineux" : ""}
			</li>
			<li>
				<img src={param.dataEvent.sponso ? sponso : fadedSponso} />
				<br />
				{param.dataEvent.sponso ? "Sponsorisé" : ""}
			</li>
		</ul>
	);
};

const SubscribeButton = param => {
	const [stud, setStud] = useState({});
	const [isSubbed, setIsSubbed] = useState(undefined);
	const {isConfirmed} = useConfirm();

	const sub = async () => {
		setIsSubbed(undefined);
		let nb_places, price, subbed;
		if (stud.isPremium) {
			if (param.dataEvent.nb_places === -42) nb_places = 4242;
			else nb_places = param.dataEvent.nb_places;
			price = param.dataEvent.premium_cost;
			subbed = param.dataEvent.subbed;
		} else {
			if (param.dataEvent.nb_places === -42) nb_places = 4242;
			else
				nb_places =
					param.dataEvent.nb_places -
					param.dataEvent.nb_premium_places;
			price = param.dataEvent.cost;
			subbed = param.dataEvent.subbed - param.dataEvent.premium_subbed;
		}
		if (subbed >= nb_places) {
			NotificationManager.warning(
				"L'évènement est plein",
				"Attention",
				5000
			);
			setIsSubbed(false);
			return;
		}
		if (price !== 0) {
			await isConfirmed(
				`Contacte un membre du BDE pour payer et valider ton inscription !`
			);
			setIsSubbed(false);
			return;
		}
		await fetch(
			`${process.env.REACT_APP_API_URL}/inscription/me/${param.dataEvent.id}`,
			{
				method: "POST",
				credentials: "include"
			}
		)
			.then(response => {
				if (!response.ok) {
					setIsSubbed(false);
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
			})
			.then(setIsSubbed(true))
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	};

	const unsub = async () => {
		setIsSubbed(undefined);
		let price;
		if (stud.isPremium) {
			price = param.dataEvent.premium_cost;
		} else {
			price = param.dataEvent.cost;
		}
		if (price !== 0) {
			await isConfirmed(
				`Contacte un membre du BDE pour te faire rembourser et compléter ta désinscription !`
			);
			setIsSubbed(true);
			return;
		}
		await fetch(
			`${process.env.REACT_APP_API_URL}/inscription/minecraft/${param.dataEvent.id}`,
			{
				method: "DELETE",
				credentials: "include"
			}
		)
			.then(response => {
				if (!response.ok) {
					setIsSubbed(true);
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
			})
			.then(() => {
				setIsSubbed(false);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	};

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/stud/minecraft/`, {
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
				setStud(data);
				param.setIsPremium(data.isPremium);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, []);

	useEffect(() => {
		if (
			param.dataEvent.id === undefined ||
			param.dataEvent.id === "" ||
			!param.dataEvent.id
		)
			return;
		fetch(
			`${process.env.REACT_APP_API_URL}/inscription/${param.dataEvent.id}/isSubbed`,
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
				setIsSubbed(data.isSubbed);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, [param]);

	return (
		<div className={style.buttons}>
			<button onClick={param.closeEvent}>Fermer</button>
			<button
				disabled={isSubbed === undefined}
				onClick={isSubbed ? unsub : sub}
				className={style.subButton}
			>
				{isSubbed ? "Désinscription" : "Inscription"}
			</button>
		</div>
	);
};

export default Event;
