import {React, useState, useEffect} from "react";
import EventList from "../../components/EventList";
import EventListPublic from "../../components/EventListPublic";
import {NotificationManager} from "react-notifications";
import CheckSet from "../../components/CheckSet";
import {LoadingSmall, LoadingMicro} from "../../components/Loading";

import style from "../../style/Home.module.scss";
import frontImage from "../../assets/images/front.webp";
import blank from "../../assets/placeholders/tmp_profile.png";
import Product from "./Product.js";

import aguemazi from "../../assets/images/aguemazi.webp";
import mcacoilo from "../../assets/images/mcacoilo.webp";
import Link from "../../assets/images/Link.webp";
import iCARUS from "../../assets/images/iCARUS.webp";
import mwinter from "../../assets/images/mwinter-.webp";
import tbrissia from "../../assets/images/tbrissia.webp";
import mfusil from "../../assets/images/mfusil.webp";
import tvanbael from "../../assets/images/tvanbael.webp";
import jdutschk from "../../assets/images/jdutschk.webp";
import jrasser from "../../assets/images/jrasser.webp";

const Home = () => {
	const [session, setSession] = useState(0);
	const [filter, setFilter] = useState({
		current: true,
		free: false,
		available: false,
		food: false,
		unlimited: false,
		outside: false,
		sponso: false,
		sort: "begin_date",
		asc: false,
		available_date: true
	});

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/session`, {
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
			.then(json => {
				setSession(json);
			});
	}, []);

	return (
		<div className={style.homeContainer}>
			<HeaderHome />
			<div className={style.lists}>
				<div>
					<h2>Nos Évènements</h2>
					<hr />
					{session !== 0 ? (
						session.clearance >= 2 ? (
							<>
								<EventList
									filter={filter}
									className={style.col}
								/>
								<Filter filter={filter} setFilter={setFilter} />
							</>
						) : (
							<EventListPublic />
						)
					) : (
						<></>
					)}
				</div>
				<ProductList session={session} />
			</div>
			<Presentation />
		</div>
	);
};

const HeaderHome = () => {
	return (
		<div className={style.frontImage}>
			<img src={frontImage} />
			<div className={style.color} />
			<div className={style.text}>
				<h1>BDE 42 Mulhouse</h1>
				<span>
					<p>
						Bienvenue sur le site de La Frégate, l'association
						auto-gérée remplissant le rôle du BDE de 42 Mulhouse !
					</p>
					<p>
						Vous y retrouverez les évènements à venir ainsi que la
						possibilité de vous y inscrire,
					</p>
					<p>
						Mais aussi les informations sur les goodies que nous
						vous proposons{" "}
						{
							//ou encore les clubs de l'école !
						}
						et plus encore à l'avenir !
					</p>
				</span>
			</div>
		</div>
	);
};

const Filter = param => {
	const handleFormChange = event => {
		let tempFilter = {...param.filter};
		const target = event.target;
		const value =
			target.type === "checkbox" ? target.checked : target.value;
		const name = target.name;
		tempFilter[name] = value;
		param.setFilter(tempFilter);
	};

	const filterHanddler = () => {
		if (
			document.getElementById(style.dropdownMenu).style.display ===
			"block"
		)
			document.getElementById(style.dropdownMenu).style.display = "none";
		else
			document.getElementById(style.dropdownMenu).style.display = "block";
	};

	useEffect(() => {
		function handleClick(e) {
			if (
				document.getElementById(style.dropdownMenu) !== e.target &&
				!document
					.getElementById(style.dropdownMenu)
					.contains(e.target) &&
				document.getElementById(style.dropdownMenu).style.display ===
					"block" &&
				document.getElementById(style.dropdownButton) !== e.target &&
				!document
					.getElementById(style.dropdownButton)
					.contains(e.target)
			) {
				filterHanddler();
			}
		}
		window.addEventListener("click", handleClick);
		return () => window.removeEventListener("click", handleClick);
	}, []);

	return (
		<div className={`${style.eventFilter} ${style.col}`}>
			<button onClick={filterHanddler} id={style.dropdownButton}>
				Filtrer
			</button>
			<div id={style.dropdownMenu}>
				<CheckSet
					set={[
						{
							label: "Gratuit",
							name: "free",
							checked: param.filter.free
						},
						{
							label: "Places restantes",
							name: "available",
							checked: param.filter.available
						},
						{
							label: "Consommations",
							name: "food",
							checked: param.filter.food
						},
						{
							label: "A l'extérieur",
							name: "outside",
							checked: param.filter.outside
						},
						{
							label: "Places illimitées",
							name: "unlimited",
							checked: param.filter.unlimited
						},
						{
							label: "Sponsorisé",
							name: "sponso",
							checked: param.filter.sponso
						}
					]}
					onChange={handleFormChange}
					type="checkbox"
				/>
			</div>
		</div>
	);
};

const ProductList = param => {
	const [products, setProducts] = useState([]);
	const [thumbnailHoodies, setThumbnailHoodies] = useState(blank);
	const [thumbnailTshirt, setThumbnailTshirt] = useState(blank);
	const [thumbnailCap, setThumbnailCap] = useState(blank);
	const [popUp, setPopUp] = useState(-1);

	useEffect(() => {
		if (products[2] === undefined || products[2] === null) return;
		fetch(
			`${process.env.REACT_APP_API_URL}/goodies/${products[2].id}/thumbnail`,
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
				setThumbnailCap(URL.createObjectURL(blob));
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, [products]);

	useEffect(() => {
		if (products[0] === undefined || products[0] === null) return;
		fetch(
			`${process.env.REACT_APP_API_URL}/goodies/${products[0].id}/thumbnail`,
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
				setThumbnailHoodies(URL.createObjectURL(blob));
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, [products]);

	useEffect(() => {
		if (products[1] === undefined || products[1] === null) return;
		fetch(
			`${process.env.REACT_APP_API_URL}/goodies/${products[1].id}/thumbnail`,
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
				setThumbnailTshirt(URL.createObjectURL(blob));
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, [products]);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/goodies`, {
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
				setProducts(data);
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, []);

	return (
		<div className={style.ProductListContainer}>
			<h2>NOS PRODUITS</h2>
			<hr />
			<div className={style.thumbnailsContainer}>
				<img
					src={thumbnailHoodies}
					onClick={() => {
						setPopUp(products[0].id);
					}}
				/>
				<div className={style.miniThumbnailsContainer}>
					<img
						src={thumbnailTshirt}
						onClick={() => {
							setPopUp(products[1].id);
						}}
					/>
					<img
						src={thumbnailCap}
						onClick={() => {
							setPopUp(products[2].id);
						}}
					/>
				</div>
			</div>
			{popUp !== -1 && (
				<>
					<div id={style.filter}>
						<div
							id={style.outArea}
							onClick={() => {
								setPopUp(-1);
							}}
						></div>
						<Product
							session={param.session}
							id={popUp}
							setPopUp={setPopUp}
							closeEvent={() => {
								setPopUp(-1);
							}}
						/>
					</div>
				</>
			)}
		</div>
	);
};

const EquipePicture = props => {
	return (
		<>
			<a
				href={`https://profile.intra.42.fr/users/${props.login}`}
				target="_blank"
				rel="noopener noreferrer"
			>
				<img src={props.img} height={100} width="auto" />
			</a>
		</>
	);
};

const Presentation = () => {
	return (
		<div className={style.presentationContainer}>
			<hr />
			<h2>Notre Équipe</h2>
			<div className={style.bureauFaces}>
				<div className={style.pole}>
					<div className={style.equipePictureContainer}>
						<EquipePicture login="aguemazi" img={aguemazi} />
					</div>
					<h3>Capitaine</h3>
				</div>
				<div className={style.pole}>
					<div className={style.equipePictureContainer}>
						<EquipePicture login="tvanbael" img={tvanbael} />
						<EquipePicture login="jrasser" img={jrasser} />
					</div>
					<h3>Vice-Capitaines</h3>
				</div>
				<div className={style.pole}>
					<div className={style.equipePictureContainer}>
						<EquipePicture login="Link" img={Link} />
						<EquipePicture login="tbrissia" img={tbrissia} />
					</div>
					<h3>Trésoriers</h3>
				</div>
				<div className={style.pole}>
					<div className={style.equipePictureContainer}>
						<EquipePicture login="iCARUS" img={iCARUS} />
						<EquipePicture login="mcacoilo" img={mcacoilo} />
					</div>
					<h3>Secrétaires</h3>
				</div>
				<div className={style.pole}>
					<div className={style.equipePictureContainer}>
						<EquipePicture login="mwinter-" img={mwinter} />
						<EquipePicture login="mfusil" img={mfusil} />
					</div>
					<h3>Responsables communication</h3>
				</div>
				<div className={style.pole}>
					<div className={style.equipePictureContainer}>
						<EquipePicture login="jdutschk" img={jdutschk} />
					</div>
					<h3>Responsable partenariats</h3>
				</div>
			</div>
		</div>
	);
};

export default Home;
