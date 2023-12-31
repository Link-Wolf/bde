import { useState, useEffect, React } from "react";
import { NotificationManager } from "react-notifications";
import useConfirm from "./useConfirm";

import style from "../style/Event.module.scss";

import durationLogo from "../assets/logos/time.svg";
import locationLogo from "../assets/logos/location.svg";
import nbPlacesLogo from "../assets/logos/places.svg";
import inscCostLogo from "../assets/logos/price.svg";
import dateTimeLogo from "../assets/logos/date.svg";
import isOutsideLogo from "../assets/logos/outside.svg";
import conso from "../assets/logos/consos.svg";
import sponso from "../assets/logos/sponso.svg";
import pool from "../assets/logos/pool.svg";
import fadedConso from "../assets/logos/fadedConsos.svg";
import fadedSponso from "../assets/logos/fadedSponso.svg";
import fadedPool from "../assets/logos/fadedPool.svg";

/**
 * @brief Display the event popup with all the informations about the event and the possibility to subscribe
 * @param id The id of the event
 * @param closeEvent The function to close the event popup
 * @returns The event popup
 */
const Event = (param) => {
	const [dataEvent, setDataEvent] = useState([]);
	const [isSubbed, setIsSubbed] = useState(undefined);
	const [duration, setDuration] = useState("Never Ending Fun");
	const [isPremium, setIsPremium] = useState(undefined);

	/**
	 * @brief get the details of the event on the server
	 */
	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/event/${param.id}`, {
			credentials: "include",
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error:
						The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then((actualData) => {
				setDataEvent(actualData);
				if (actualData.end_date) {
					const span =
						new Date(actualData.end_date) -
						new Date(actualData.begin_date);
					const span_hour = span / 1000 / 60 / 60;
					const span_days = span_hour / 24;
					if (span_hour >= 72)
						setDuration(`${Math.round(span_days)} jour(s)`);
					else setDuration(`${Math.round(span_hour)} heure(s)`);
				}
			})
			.catch(function (error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
				window.location = "/events";
			});
	}, [param.id, isSubbed]);

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
							setIsSubbed={setIsSubbed}
							isSubbed={isSubbed}
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

/**
 * @brief Get the thumbnail of the event and display it
 */
const Thumbnail = (param) => {
	const [thumbnail, setThumnail] = useState(null);

	useEffect(() => {
		if (param.id === undefined || param.id === "" || !param.id) return;
		fetch(`${process.env.REACT_APP_API_URL}/event/${param.id}/thumbnail`, {
			credentials: "include",
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is` +
							` ${response.status}`
					);
				}
				return response.blob();
			})
			.then((blob) => {
				setThumnail(URL.createObjectURL(blob));
			})
			.catch(function (error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, [param.id]);

	return (
		<div className={style.thumbnail}>
			<img alt="" src={thumbnail} />
		</div>
	);
};

/**
 * @brief Display the details of the event
 */
const Description = (param) => {
	if (param.dataEvent.desc == "" || param.dataEvent.desc == undefined) return;
	return (
		<div id={style.desc}>
			{param.dataEvent.desc.split("\n").map((line, i) => (
				<p className={style.pDesc} eventKey={i}>
					{line}
				</p>
			))}
		</div>
	);
};

/**
 * @brief Display the title of the event
 */
const Title = (param) => {
	return <h1>{param.dataEvent.name}</h1>;
};

/**
 * @brief Display the duration of the event
 */
const DateDuration = (param) => {
	if (!param.dataEvent.begin_date) return;
	return (
		<div>
			<div>
				<img alt="" src={dateTimeLogo} />
				{new Intl.DateTimeFormat("fr-FR", {
					day: "numeric",
					month: "short",
					year: "numeric",
					hour: "2-digit",
					minute: "2-digit",
				}).format(new Date(param.dataEvent.begin_date))}
			</div>
			<div>
				<img alt="" src={durationLogo} />
				{param.duration}
			</div>
		</div>
	);
};

/**
 * @brief Display the price of the event
 */
const Price = (param) => {
	return (
		<>
			<div className={style.price}>
				<div />
				{param.dataEvent.cost !== 0 ? (
					<a className={style.no}>
						<div>
							Prix
							<img alt="" src={inscCostLogo} />
						</div>
						{(Math.round(param.dataEvent.cost * 100) / 100).toFixed(
							2
						)}
					</a>
				) : (
					"Gratuit"
				)}
				<div />
			</div>
		</>
	);
};

/**
 * @brief Display the details of the events
 */
const Details = (param) => {
	return (
		<ul>
			<li>
				<img alt="" src={nbPlacesLogo} />
				<br />
				{param.dataEvent.subbed} /{" "}
				{param.dataEvent.nb_places === -42 ? (
					<>∞</>
				) : (
					param.dataEvent.nb_places
				)}
			</li>
			<li>
				<img alt="" src={locationLogo} />
				<br />
				{param.dataEvent.place}
			</li>
			<li>
				<img alt="" src={isOutsideLogo} />
				<br />
				{param.dataEvent.isOutside ? "Dehors" : "À l'école"}
			</li>
			<li>
				<img alt="" src={param.dataEvent.consos ? conso : fadedConso} />
				<br />
				{param.dataEvent.consos ? "Consommations" : ""}
			</li>
			<li>
				<img alt="" src={param.dataEvent.for_pool ? pool : fadedPool} />
				<br />
				{param.dataEvent.for_pool ? "Piscineux" : ""}
			</li>
			<li>
				<img
					alt=""
					src={param.dataEvent.sponso ? sponso : fadedSponso}
				/>
				<br />
				{param.dataEvent.sponso ? "Sponsorisé" : ""}
			</li>
		</ul>
	);
};

/**
 * @brief Display the button to subscribe to the event and handle the subscription
 */
const SubscribeButton = (param) => {
	const [stud, setStud] = useState({});
	const { isConfirmed } = useConfirm();

	const sub = async () => {
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
			param.setIsSubbed(false);
			return;
		}
		if (price !== 0) {
			await isConfirmed(
				`Le paiement en ligne sera bientôt disponbile ! D'ici là, contacte un membre du BDE pour payer et valider ton inscription !`
			);
			param.setIsSubbed(false);
			//window.location = `/purchase/${param.dataEvent.id}`;
			return;
		}
		await fetch(
			`${process.env.REACT_APP_API_URL}/inscription/me/${param.dataEvent.id}`,
			{
				method: "POST",
				credentials: "include",
			}
		)
			.then((response) => {
				if (!response.ok) {
					param.setIsSubbed(false);
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
			})
			.then(param.setIsSubbed(true))
			.catch(function (error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	};

	const unsub = async () => {
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
			param.setIsSubbed(true);
			return;
		}
		await fetch(
			`${process.env.REACT_APP_API_URL}/inscription/minecraft/${param.dataEvent.id}`,
			{
				method: "DELETE",
				credentials: "include",
			}
		)
			.then((response) => {
				if (!response.ok) {
					param.setIsSubbed(true);
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
			})
			.then(() => {
				param.setIsSubbed(false);
			})
			.catch(function (error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	};

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/stud/minecraft/`, {
			method: "GET",
			credentials: "include",
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then((data) => {
				setStud(data);
				param.setIsPremium(data.isPremium);
			})
			.catch(function (error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
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
				credentials: "include",
			}
		)
			.then((response) => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then((data) => {
				param.setIsSubbed(data.isSubbed);
			})
			.catch(function (error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, [param]);

	return (
		<div className={style.buttons}>
			<button onClick={param.closeEvent}>Fermer</button>
			<button
				disabled={
					param.isSubbed === undefined ||
					(param.dataEvent.sub_date &&
						new Date(param.dataEvent.sub_date) <
							new Date(Date.now()))
				}
				title={
					param.isSubbed === undefined ||
					(param.dataEvent.sub_date &&
						new Date(param.dataEvent.sub_date) <
							new Date(Date.now()))
						? "La date d'inscription est passée"
						: ""
				}
				onClick={param.isSubbed ? unsub : sub}
				className={style.subButton}
			>
				{param.isSubbed ? "Désinscription" : "Inscription"}
			</button>
		</div>
	);
};

export default Event;
