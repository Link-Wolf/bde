import {useState, useEffect, React} from "react";
import {useParams} from "react-router-dom";
import {NotificationManager} from "react-notifications";
import useConfirm from "../../components/useConfirm";
import b64ToBlob from "b64-to-blob";
import jszip from "jszip";

import style from "../../style/Event.module.scss";

import durationLogo from "../../assets/logos/time.png";
import locationLogo from "../../assets/logos/location.png";
import nbPlacesLogo from "../../assets/logos/places.png";
import inscCostLogo from "../../assets/logos/price.png";
import dateTimeLogo from "../../assets/logos/date.png";

const Event = () => {
	const param = useParams();
	const [dataEvent, setDataEvent] = useState([]);
	const [duration, setDuration] = useState("Never Ending Fun");

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/event/${param.id}`, {
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
			<div>
				<div>
					<Thumbnail id={param.id} />
					<Description duration={duration} dataEvent={dataEvent} />
				</div>
				<SubscribeButton dataEvent={dataEvent} />
			</div>
			<EventAlbum id={param.id} />
		</div>
	);
};

const Thumbnail = param => {
	const [thumbnail, setThumnail] = useState(null);

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

	return (
		<div className={style.thumbailContainer}>
			<img src={thumbnail} />
		</div>
	);
};

const Description = param => {
	return (
		<div className={style.descriptionContainer}>
			<div>
				<h1>{param.dataEvent.name}</h1>
				<h2>
					<img src={dateTimeLogo} />
					{new Date(
						param.dataEvent.begin_date
					).toLocaleDateString()},{" "}
					{new Date(param.dataEvent.begin_date).toLocaleTimeString()}
				</h2>
				<h2>
					<img src={nbPlacesLogo} />
					{param.dataEvent.subbed} / {param.dataEvent.nb_places}
				</h2>
				<h2>
					<img src={locationLogo} />
					{param.dataEvent.place}
				</h2>
				<h2>
					<img src={inscCostLogo} />
					{param.dataEvent.cost}
				</h2>
				<h2>
					<img src={durationLogo} />
					{param.duration}
				</h2>
			</div>
			<p>{param.dataEvent.desc}</p>
		</div>
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
			nb_places = param.dataEvent.nb_places;
			price = param.dataEvent.premium_cost;
			subbed = param.dataEvent.subbed;
		} else {
			nb_places =
				param.dataEvent.nb_places - param.dataEvent.nb_premium_places;
			price = param.dataEvent.cost;
			subbed = param.dataEvent.subbed - param.dataEvent.premium_subbed;
		}
		if (subbed >= nb_places) {
			NotificationManager.warning("L'event est plein", "Pardon", 3000);
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
			`http://${global.config.api.authority}/inscription/me/${param.id}`,
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
				`Contacte un membre du BDE pour te faire rembourser et retirer ton inscription !`
			);
			setIsSubbed(true);
			return;
		}
		await fetch(
			`http://${global.config.api.authority}/inscription/minecraft/${param.id}`,
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
				setStud(data);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, []);

	useEffect(() => {
		fetch(
			`http://${global.config.api.authority}/inscription/${param.dataEvent.id}/isSubbed`,
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
		<div className={style.buttonContainer}>
			<button
				disabled={isSubbed === undefined}
				onClick={isSubbed ? unsub : sub}
				className={style.subButton}
			>
				{isSubbed ? "Desinscription" : "Inscription"}
			</button>
		</div>
	);
};

const EventAlbum = param => {
	const [photos, setPhotos] = useState([]);

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/event/${param.id}/album`, {
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.text();
			})
			.then(zipAsBase64 => {
				const blob = b64ToBlob(zipAsBase64, "application/zip");
				return blob;
			})
			.then(arrayBuffer => {
				jszip.loadAsync(arrayBuffer).then(({files}) => {
					const mediaFiles = Object.entries(
						files
					).filter(([fileName]) => fileName.endsWith(".jpg"));

					if (!mediaFiles.length) {
						throw new Error("No media files found in archive");
					}

					mediaFiles.forEach(([, image], i) => {
						image.async("blob").then(blob => {
							let tmp = photos;
							tmp[i] = URL.createObjectURL(blob);
							setPhotos(tmp);
						});
					});
				});
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, [param.id]);

	return photos.length > 0 ? (
		<div className={style.albumContainer}>
			{photos.map((photo, i) => (
				<img key={i} src={photo} />
			))}
		</div>
	) : (
		<></>
	);
};

export default Event;
