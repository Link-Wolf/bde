import {useState, useEffect, React} from "react";
import {NotificationManager} from "react-notifications";
import useConfirm from "../../components/useConfirm";
import b64ToBlob from "b64-to-blob";
import jszip from "jszip";

import style from "../../style/Product.module.scss";

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

const Product = param => {
	const [dataProduct, setDataProduct] = useState([]);
	const [isSubbed, setIsSubbed] = useState(undefined);
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
				setDataProduct(actualData);
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
	}, [param.id, isSubbed]);

	return (
		<div className={style.eventContainer}>
			<div className={style.headerProduct}>
				<Thumbnail id={param.id} />
				<div className={style.titleHeader}>
					<Title dataProduct={dataProduct} />
					<DateDuration
						dataProduct={dataProduct}
						duration={duration}
					/>
				</div>
			</div>
			<div className={style.bodyProduct}>
				<Details duration={duration} dataProduct={dataProduct} />
				<div>
					<div>
						<hr id={style.niktameredegagedemapagegrossemerde} />

						<Description dataProduct={dataProduct} />
						<hr />
					</div>
					<div>
						<Price
							dataProduct={dataProduct}
							isPremium={isPremium}
						/>
						<SubscribeButton
							setIsSubbed={setIsSubbed}
							isSubbed={isSubbed}
							closeProduct={param.closeProduct}
							dataProduct={dataProduct}
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
	return <p>{param.dataProduct.desc}</p>;
};

const Title = param => {
	return <h1>{param.dataProduct.name}</h1>;
};

const DateDuration = param => {
	if (!param.dataProduct.begin_date) return;
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
				}).format(new Date(param.dataProduct.begin_date))}
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
						{param.dataProduct.cost},00
					</a>
				)}
				{(param.isPremium || param.dataProduct.cost !== 0) && (
					<a
						className={!param.isPremium ? style.no : style.yes}
						href="/purchase/contrib"
					>
						<div>
							Prilivège
							<img src={inscCostLogo} />
						</div>

						{param.dataProduct.premium_cost !== 0
							? param.dataProduct.premium_cost
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
				{param.dataProduct.subbed} /{" "}
				{param.dataProduct.nb_places === -42 ? (
					<>∞</>
				) : (
					param.dataProduct.nb_places
				)}
			</li>
			<li>
				<img src={locationLogo} />
				<br />
				{param.dataProduct.place}
			</li>
			<li>
				<img src={isOutsideLogo} />
				<br />
				{param.dataProduct.isOutside ? "Dehors" : "À l'école"}
			</li>
			<li>
				<img src={param.dataProduct.consos ? conso : fadedConso} />
				<br />
				{param.dataProduct.consos ? "Consommations" : ""}
			</li>
			<li>
				<img src={param.dataProduct.for_pool ? pool : fadedPool} />
				<br />
				{param.dataProduct.for_pool ? "Piscineux" : ""}
			</li>
			<li>
				<img src={param.dataProduct.sponso ? sponso : fadedSponso} />
				<br />
				{param.dataProduct.sponso ? "Sponsorisé" : ""}
			</li>
		</ul>
	);
};

const SubscribeButton = param => {
	const [stud, setStud] = useState({});
	const {isConfirmed} = useConfirm();

	const sub = async () => {
		let nb_places, price, subbed;
		if (stud.isPremium) {
			if (param.dataProduct.nb_places === -42) nb_places = 4242;
			else nb_places = param.dataProduct.nb_places;
			price = param.dataProduct.premium_cost;
			subbed = param.dataProduct.subbed;
		} else {
			if (param.dataProduct.nb_places === -42) nb_places = 4242;
			else
				nb_places =
					param.dataProduct.nb_places -
					param.dataProduct.nb_premium_places;
			price = param.dataProduct.cost;
			subbed =
				param.dataProduct.subbed - param.dataProduct.premium_subbed;
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
			// await isConfirmed(
			// 	`Contacte un membre du BDE pour payer et valider ton inscription !`
			// );
			// setIsSubbed(false);
			window.location = `/purchase/${param.dataProduct.id}`;
			return;
		}
		await fetch(
			`${process.env.REACT_APP_API_URL}/inscription/me/${param.dataProduct.id}`,
			{
				method: "POST",
				credentials: "include"
			}
		)
			.then(response => {
				if (!response.ok) {
					param.setIsSubbed(false);
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
			})
			.then(param.setIsSubbed(true))
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	};

	const unsub = async () => {
		let price;
		if (stud.isPremium) {
			price = param.dataProduct.premium_cost;
		} else {
			price = param.dataProduct.cost;
		}
		if (price !== 0) {
			await isConfirmed(
				`Contacte un membre du BDE pour te faire rembourser et compléter ta désinscription !`
			);
			param.setIsSubbed(true);
			return;
		}
		await fetch(
			`${process.env.REACT_APP_API_URL}/inscription/minecraft/${param.dataProduct.id}`,
			{
				method: "DELETE",
				credentials: "include"
			}
		)
			.then(response => {
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
			param.dataProduct.id === undefined ||
			param.dataProduct.id === "" ||
			!param.dataProduct.id
		)
			return;
		fetch(
			`${process.env.REACT_APP_API_URL}/inscription/${param.dataProduct.id}/isSubbed`,
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
				param.setIsSubbed(data.isSubbed);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, [param]);

	return (
		<div className={style.buttons}>
			<button onClick={param.closeProduct}>Fermer</button>
			<button
				disabled={param.isSubbed === undefined}
				onClick={param.isSubbed ? unsub : sub}
				className={style.subButton}
			>
				{param.isSubbed ? "Désinscription" : "Inscription"}
			</button>
		</div>
	);
};

export default Product;
