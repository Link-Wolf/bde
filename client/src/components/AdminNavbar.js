import React, {useState, useEffect} from "react";
import useConfirm from "./useConfirm";

import style from "../style/AdminNavbar.module.scss";
import burger from "../assets/logos/burger.png";

const AdminNavbar = () => {
	const [session, setSession] = useState({clearance: 0});
	const [expended, setExpended] = useState(true);
	const {isConfirmed} = useConfirm();
	const initDb = async () => {
		const confirm = await isConfirmed(
			`Wesh bg, fait pas le con, c'est que pour le debug les gros boutons`
		);
		if (!confirm) return;
		await fetch(`http://${global.config.api.authority}/stud`, {
			headers: {"Content-Type": "application/json"},
			method: "POST",
			credentials: "include",
			body: JSON.stringify({
				login: "iCARUS",
				firstname: "###",
				lastname: "azphael",
				email: "iCARUS@student.42mulhouse.fr",
				isDirection: true,
				clearance: 42
			})
		})
			.then(() => {
				fetch(`http://${global.config.api.authority}/stud`, {
					headers: {"Content-Type": "application/json"},
					method: "POST",
					credentials: "include",
					body: JSON.stringify({
						login: "Link",
						firstname: "xxxxx",
						lastname: "xxxxxx",
						email: "Link@student.42mulhouse.fr",
						isDirection: true,
						clearance: 42
					})
				});
			})
			.then(() => {
				fetch(`http://${global.config.api.authority}/stud`, {
					headers: {"Content-Type": "application/json"},
					method: "POST",
					credentials: "include",
					body: JSON.stringify({
						login: "yoyostud",
						firstname: "yohan",
						lastname: "tollet",
						email: "",
						isDirection: false,
						clearance: 7
					})
				});
			})
			.then(() => {
				fetch(`http://${global.config.api.authority}/goodies`, {
					headers: {"Content-Type": "application/json"},
					method: "POST",
					credentials: "include",
					body: JSON.stringify({
						name: "42 Mulhouse Hoodie Premium+",
						cost: 40,
						desc:
							"Oui bonjour c'est le sweet ultra premium qu'a l'air sympa",
						available: true
					})
				});
			})
			.then(() => {
				fetch(`http://${global.config.api.authority}/goodies`, {
					headers: {"Content-Type": "application/json"},
					method: "POST",
					credentials: "include",
					body: JSON.stringify({
						name: "Casquette noire BDE",
						cost: 10,
						desc: "Casquette avec logo 42 mulhouse",
						available: true
					})
				});
			})
			.then(() => {
				fetch(`http://${global.config.api.authority}/goodies`, {
					headers: {"Content-Type": "application/json"},
					method: "POST",
					credentials: "include",
					body: JSON.stringify({
						name: "42 Mulhouse T Shirt noir",
						cost: 15,
						desc: "T shirt noir 42 mulhouse logo coeur + pas dos",
						available: 0
					})
				});
			})
			.then(() => {
				fetch(`http://${global.config.api.authority}/event`, {
					headers: {"Content-Type": "application/json"},
					method: "POST",
					credentials: "include",
					body: JSON.stringify({
						name: "Loup Garou",
						cost: 5,
						premium_cost: 3,
						nb_places: 15,
						begin_date: "06-13-2022",
						end_date: "06-13-2022",
						desc: "L'uwu garou du vendredi matin en jeu de cartes",
						place: "cantina",
						isOutside: false,
						consos: true,
						for_pool: true,
						available: false,
						sponso: false,
						thumbnail_filename: "assets/thumbnails/events/1.jpeg"
					})
				});
			})
			.then(() => {
				fetch(`http://${global.config.api.authority}/event`, {
					headers: {"Content-Type": "application/json"},
					method: "POST",
					credentials: "include",
					body: JSON.stringify({
						name: "Tournoi Echecs",
						cost: 0,
						nb_places: -42,
						begin_date: "06-13-2022",
						end_date: "06-14-2023",
						place: "cantina",
						isOutside: false,
						consos: true,
						for_pool: false,
						available: false,
						sponso: false,
						thumbnail_filename: "assets/thumbnails/events/2.jpeg"
					})
				});
			})
			.then(() => {
				fetch(`http://${global.config.api.authority}/event`, {
					headers: {"Content-Type": "application/json"},
					method: "POST",
					credentials: "include",
					body: JSON.stringify({
						name: "Ventriglisse",
						cost: 15,
						nb_places: 50,
						begin_date: "06-13-2022",
						place: "Derriere 42",
						desc: "Ventriglisse sur nos corps huilés et musculeux",
						isOutside: false,
						consos: true,
						for_pool: false,
						available: true,
						sponso: false,
						thumbnail_filename: "assets/thumbnails/events/3.jpeg"
					})
				});
			})
			.then(() => {
				fetch(`http://${global.config.api.authority}/event`, {
					headers: {"Content-Type": "application/json"},
					method: "POST",
					credentials: "include",
					body: JSON.stringify({
						name: "Laser game",
						cost: 7,
						premium_cost: 5,
						nb_places: 19,
						begin_date: "06-13-2022",
						end_date: "06-15-2022",
						place: "42 rue de la norminette 69420 Mulhouse",
						desc: "piou piou avec des lasers",
						isOutside: true,
						consos: false,
						for_pool: true,
						available: false,
						sponso: false,
						thumbnail_filename: "assets/thumbnails/events/4.jpeg"
					})
				});
			})
			.then(() => {
				fetch(`http://${global.config.api.authority}/contribution`, {
					headers: {"Content-Type": "application/json"},
					method: "POST",
					credentials: "include",
					body: JSON.stringify({
						studLogin: "yoyostud"
					})
				});
			})
			.then(() => {
				fetch(`http://${global.config.api.authority}/contribution`, {
					headers: {"Content-Type": "application/json"},
					method: "POST",
					credentials: "include",
					body: JSON.stringify({
						studLogin: "Link",
						begin_date: "12-12-2022"
					})
				});
			});
	};
	const tiniDb = async () => {
		const confirm = await isConfirmed(
			`T'es archi sur de vouloir enculer la database ???`
		);
		if (!confirm) return;
		fetch(`http://${global.config.api.authority}/stud`, {
			credentials: "include",
			method: "DELETE"
		})
			.then(() => {
				fetch(`http://${global.config.api.authority}/event`, {
					credentials: "include",
					method: "DELETE"
				});
			})
			.then(() => {
				fetch(`http://${global.config.api.authority}/goodies`, {
					credentials: "include",
					method: "DELETE"
				});
			})
			.then(() => {
				fetch(`http://${global.config.api.authority}/inscription`, {
					credentials: "include",
					method: "DELETE"
				});
			})
			.then(() => {
				fetch(`http://${global.config.api.authority}/contribution`, {
					credentials: "include",
					method: "DELETE"
				});
			});
	};

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/session`, {
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
				setSession(data);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, []);

	return (
		<div className={style.adminNavbarContainer}>
			<a
				id={style.expendButton}
				onClick={() => {
					setExpended(!expended);
				}}
			>
				<img src={burger} />
			</a>
			{expended && (
				<>
					<a href="/admin">
						<h2>Admin pannel</h2>
					</a>
					<a href="/admin/students">
						<h3>Students</h3>
					</a>
					<a href="/admin/events/gestion">
						<h3>Events</h3>
					</a>
					<a href="/admin/events/subscribtions">
						<h3>Inscriptions</h3>
					</a>
					<a href="/admin/contributions">
						<h3>Cotisations</h3>
					</a>
					<a href="/admin/shop">
						<h3>Shop</h3>
					</a>
					<a href="/admin/logs">
						<h3>Logs</h3>
					</a>
					<a href="/admin/unpaidmanagement">
						<h3>Unpaid Management</h3>
					</a>
					{session.clearance >= 21 ? (
						<a href="/admin/teammanagement">
							<h3>Team Management</h3>
						</a>
					) : (
						<></>
					)}
					{session.clearance >= 42 && (
						<div>
							<button id={style.bigYellowButton} onClick={initDb}>
								Init DB
							</button>
							<button id={style.bigRedButton} onClick={tiniDb}>
								Yeet DB
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default AdminNavbar;
