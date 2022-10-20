import {React, useState, useEffect} from "react";
import EventList from "../../components/EventList";
import CheckSet from "../../components/CheckSet";
import {LazyLoadImage} from "react-lazy-load-image-component";

import style from "../../style/Home.module.scss";
import frontImage from "../../assets/images/front.jpg";

const Home = () => {
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

	return (
		<div className={style.homeContainer}>
			<HeaderHome />
			<div className={style.lists}>
				<div>
					<h2>Nos Evènements</h2>
					<hr />
					<EventList filter={filter} className={style.col} />{" "}
					<Filter filter={filter} setFilter={setFilter} />
				</div>
				<ProductList />
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
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Nulla eget leo sollicitudin, lacinia dui ut, dictum
						metus.
					</p>
					<p>
						Curabitur laoreet iaculis arcu eget elementum. Donec
						risus magna, rhoncus quis ipsum in, maximus mattis nibh.{" "}
					</p>
					<p>
						Donec at nunc eu ipsum ultricies sagittis. Aliquam ac
						mauris lobortis, consequat quam at, luctus lacus.
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
			document.getElementById(style.dropdownMenu).style.display == "block"
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
				document.getElementById(style.dropdownMenu).style.display ==
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
							label: "Free",
							name: "free",
							checked: param.filter.free
						},
						{
							label: "Available",
							name: "available",
							checked: param.filter.available
						},
						{
							label: "Miammiam glouglou",
							name: "food",
							checked: param.filter.food
						},
						{
							label: "Dehors",
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

const ProductList = () => {
	const [products, setProducts] = useState([{id: 0}, {id: 1}, {id: 2}]);
	const [thumbnailHoodies, setThumbnailHoodies] = useState(frontImage);
	const [thumbnailTshirt, setThumbnailTshirt] = useState(frontImage);
	const [thumbnailCap, setThumbnailCap] = useState(frontImage);

	useEffect(() => {
		if (products[2] === undefined || products[2] === null) return;
		fetch(
			`http://${global.config.api.authority}/goodies/${products[2].id}/thumbnail`,
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
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [products]);

	useEffect(() => {
		if (products[0] === undefined || products[0] === null) return;
		fetch(
			`http://${global.config.api.authority}/goodies/${products[0].id}/thumbnail`,
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
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [products]);

	useEffect(() => {
		if (products[1] === undefined || products[1] === null) return;
		fetch(
			`http://${global.config.api.authority}/goodies/${products[1].id}/thumbnail`,
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
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [products]);

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/goodies`, {
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
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, []);

	return (
		<div className={style.ProductListContainer}>
			<h2>NOS PRODUITS</h2>
			<hr />
			<div className={style.thumbnailsContainer}>
				<img src={thumbnailHoodies} />
				<div className={style.miniThumbnailsContainer}>
					<img src={thumbnailTshirt} />
					<img src={thumbnailCap} />
				</div>
			</div>
		</div>
	);
};

const EquipePicture = props => {
	return (
		<>
			<a href={`https://profile.intra.42.fr/users/${props.login}`}>
				<LazyLoadImage
					src={`https://cdn.intra.42.fr/users/${props.login}.jpg`}
					effect="blur"
					height={100}
					width="auto"
				/>
			</a>
		</>
	);
};

const Presentation = () => {
	return (
		<div className={style.presentationContainer}>
			<hr />
			<h2>Notre Équipe</h2>
			<div className={style.captain}>
				<div className={style.equipePictureContainer}>
					<EquipePicture login="aguemazi" />
				</div>
				<h3>Capitaine</h3>
			</div>
			<div className={style.vice}>
				<div className={style.equipePictureContainer}>
					<EquipePicture login="tvanbael" />
					<EquipePicture login="jrasser" />
				</div>
				<h3>Vice Capitaines</h3>
			</div>
			<div className={style.treasure}>
				<div className={style.equipePictureContainer}>
					<EquipePicture login="Link" />
					<EquipePicture login="tbrissia" />
				</div>
				<h3>Trésoriers</h3>
			</div>
			<div className={style.secret}>
				<div className={style.equipePictureContainer}>
					<EquipePicture login="iCARUS" />
					<EquipePicture login="mcacoilo" />
				</div>
				<h3>Secrétaires</h3>
			</div>
			<div className={style.comm}>
				<div className={style.equipePictureContainer}>
					<EquipePicture login="mwinter-" />
					<EquipePicture login="mfusil" />
				</div>
				<h3>Responsables communication</h3>
			</div>
			<div className={style.part}>
				<div className={style.equipePictureContainer}>
					<EquipePicture login="jdutschk" />
				</div>
				<h3>Responsable partenariats</h3>
			</div>

			<div className={style.presentation}>
				<p>On est gentils. Peut être.</p>
			</div>
		</div>
	);
};

export default Home;

// const getStock = () => {
// 	fetch(`http://${global.config.api.authority}/google`, {
// 		credentials: "include"
// 	})
// 		.then(response => {
// 			if (!response.ok) {
// 				throw new Error(
// 					`This is an HTTP error: The status is` +
// 						` ${response.status}`
// 				);
// 			}
// 		})
// 		.catch(function(error) {
// 			console.log(
// 				"Il y a eu un problème avec l'opération fetch: " +
// 					error.message
// 			);
// 		});
// };
