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
		await fetch(`${process.env.REACT_APP_API_URL}/stud`, {
			headers: {"Content-Type": "application/json"},
			method: "POST",
			credentials: "include",
			body: JSON.stringify({
				login: "iCARUS",
				firstname: "###",
				lastname: "Azphael",
				true_email:
					"[192,198,154,214,34,115,164,138,149,222,232,41,86,135,229,118,146,155,51,177,217,153,162,10,100,167,151,10,160,35,75,90]",
				email: "iCARUS@student.42mulhouse.fr",
				isDirection: true,
				clearance: 42
			})
		})
			.then(() => {
				fetch(`${process.env.REACT_APP_API_URL}/stud`, {
					headers: {"Content-Type": "application/json"},
					method: "POST",
					credentials: "include",
					body: JSON.stringify({
						login: "Link",
						firstname: "Xxxxx",
						lastname: "Xxxxxx",
						email: "Link@student.42mulhouse.fr",
						true_email:
							"[90,77,52,54,142,29,121,85,8,1,225,158,17,120,133,71,97,165,130,30,188,78,231,250,2,60,11,2,99,157,38,224]",
						isDirection: true,
						clearance: 42
					})
				});
			})
			.then(() => {
				fetch(`${process.env.REACT_APP_API_URL}/stud`, {
					headers: {"Content-Type": "application/json"},
					method: "POST",
					credentials: "include",
					body: JSON.stringify({
						login: "yoyostud",
						firstname: "Yohan",
						lastname: "Thollet",
						email: "",
						true_email: "",
						isDirection: false,
						clearance: 7
					})
				});
			})
			.then(() => {
				fetch(`${process.env.REACT_APP_API_URL}/goodies`, {
					headers: {"Content-Type": "application/json"},
					method: "POST",
					credentials: "include",
					body: JSON.stringify({
						name: "Hoodie Premium+ Noir brodé",
						cost: 42,
						desc:
							"Hoodie noir doublé avec logo 42 Mulhouse brodé sur le coeur en petit et en grand dans le dos",
						available: true
					})
				});
			})
			.then(() => {
				fetch(`${process.env.REACT_APP_API_URL}/goodies`, {
					headers: {"Content-Type": "application/json"},
					method: "POST",
					credentials: "include",
					body: JSON.stringify({
						name: "Casquette noire brodée",
						cost: 9.99,
						desc: "Casquette noire avec logo 42 Mulhouse brodé",
						available: true
					})
				});
			})
			.then(() => {
				fetch(`${process.env.REACT_APP_API_URL}/goodies`, {
					headers: {"Content-Type": "application/json"},
					method: "POST",
					credentials: "include",
					body: JSON.stringify({
						name: "T-shirt noir brodé",
						cost: 13.99,
						desc:
							"T-shirt noir avec logo 42 Mulhouse brodé sur le coeur",
						available: false
					})
				});
			})
			.then(() => {
				fetch(`${process.env.REACT_APP_API_URL}/event`, {
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
				fetch(`${process.env.REACT_APP_API_URL}/event`, {
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
				fetch(`${process.env.REACT_APP_API_URL}/event`, {
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
				fetch(`${process.env.REACT_APP_API_URL}/event`, {
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
				fetch(`${process.env.REACT_APP_API_URL}/contribution`, {
					headers: {"Content-Type": "application/json"},
					method: "POST",
					credentials: "include",
					body: JSON.stringify({
						studLogin: "yoyostud"
					})
				});
			})
			.then(() => {
				fetch(`${process.env.REACT_APP_API_URL}/contribution`, {
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
		fetch(`${process.env.REACT_APP_API_URL}/stud`, {
			credentials: "include",
			method: "DELETE"
		})
			.then(() => {
				fetch(`${process.env.REACT_APP_API_URL}/event`, {
					credentials: "include",
					method: "DELETE"
				});
			})
			.then(() => {
				fetch(`${process.env.REACT_APP_API_URL}/goodies`, {
					credentials: "include",
					method: "DELETE"
				});
			})
			.then(() => {
				fetch(`${process.env.REACT_APP_API_URL}/inscription`, {
					credentials: "include",
					method: "DELETE"
				});
			})
			.then(() => {
				fetch(`${process.env.REACT_APP_API_URL}/contribution`, {
					credentials: "include",
					method: "DELETE"
				});
			});
	};

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
					document.getElementById(style.panel).style.left = "0px";
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
					<g>
						<line
							x1={13.5}
							y1={2}
							x2={0.5}
							y2={2}
							fill="none"
							stroke="var(--black)"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<line
							x1={13.5}
							y1={7}
							x2={0.5}
							y2={7}
							fill="none"
							stroke="var(--black)"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<line
							x1={13.5}
							y1={12}
							x2={0.5}
							y2={12}
							fill="none"
							stroke="var(--black)"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</g>
				</svg>
			</a>
			<div id={style.panel}>
				<a
					id={style.expendButton}
					onClick={() => {
						document.getElementById(style.panel).style.left =
							"-800px";
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
						<g>
							<line
								x1={13.5}
								y1={0.5}
								x2={0.5}
								y2={13.5}
								fill="none"
								stroke="var(--white)"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<line
								x1={0.5}
								y1={0.5}
								x2={13.5}
								y2={13.5}
								fill="none"
								stroke="var(--white)"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</g>
					</svg>
				</a>
				<a href="/admin">
					<h2>Admin</h2>
				</a>
				<a href="/admin/students">
					<h3>Students</h3>
				</a>
				<a href="/admin/events/gestion">
					<h3>Évènements</h3>
				</a>
				<a href="/admin/events/subscribtions">
					<h3>Inscriptions</h3>
				</a>
				<a href="/admin/contributions">
					<h3>Cotisations</h3>
				</a>
				{
					// <a href="/admin/clubs">
					// 	<h3>Clubs</h3>
					// </a>
				}
				<a href="/admin/shop">
					<h3>Produits</h3>
				</a>
				<a href="/admin/logs">
					<h3>Logs</h3>
				</a>
				<a href="/admin/unpaidmanagement">
					<h3>Gestion volontaires</h3>
				</a>
				{session.clearance >= 21 && (
					<a href="/admin/teammanagement">
						<h3>Gestion bureau</h3>
					</a>
				)}
				{session.clearance >= 42 && (
					<div id={style.buttonContainer}>
						<button id={style.bigYellowButton} onClick={initDb}>
							Init DB
						</button>
						<button id={style.bigRedButton} onClick={tiniDb}>
							Yeet DB
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminNavbar;
