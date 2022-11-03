import React, {useState, useEffect} from "react";
import useConfirm from "./useConfirm";
import {NotificationManager} from "react-notifications";
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
				isAdmin: true,
				clearance: 42
			})
		}).then(() => {
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
					isAdmin: true,
					clearance: 42
				})
			});
		});
	};
	const getBlob = async () => {
		await fetch(`${process.env.REACT_APP_API_URL}/admin/logs/file`, {
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) throw response.statusCode;
				return response.text();
			})
			.then(b64zip => {
				const element = document.createElement("a");
				element.href = URL.createObjectURL(b64toBlob(b64zip));
				element.download = "logs" + Date.now() + ".zip";
				document.body.appendChild(element);
				element.click();
			})
			.catch(err => {});
	};

	const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
		const byteCharacters = atob(b64Data);
		const byteArrays = [];

		for (
			let offset = 0;
			offset < byteCharacters.length;
			offset += sliceSize
		) {
			const slice = byteCharacters.slice(offset, offset + sliceSize);

			const byteNumbers = new Array(slice.length);
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			const byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}

		const blob = new Blob(byteArrays, {type: contentType});
		return blob;
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
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
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
					<h3>Utilisateurs</h3>
				</a>
				<a href="/admin/events/gestion">
					<h3>Évènements</h3>
				</a>
				<a href="/admin/events/subscribtions">
					<h3>Inscriptions aux évènement</h3>
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
					<>
						<a href="/admin/teammanagement">
							<h3>Gestion des Administrateur·trice·s</h3>
						</a>
					</>
				)}
				{session.clearance >= 42 && (
					<div id={style.buttonContainer}>
						<button id={style.bigYellowButton} onClick={initDb}>
							Init sUS
						</button>
						<button onClick={getBlob}>Get Blob</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminNavbar;
