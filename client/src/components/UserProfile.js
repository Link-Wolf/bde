import React from "react";
import {useState, useEffect} from "react";
import {QRCodeSVG} from "qrcode.react";
import {NotificationManager} from "react-notifications";
import "react-lazy-load-image-component/src/effects/blur.css";
import usePagination from "./Pagination";
import {Pagination} from "@mui/material";
import style from "../style/UserProfile.module.scss";

import EventToken from "./EventToken";
import Loading from "./Loading";

const PER_PAGE = 6;

/*
 *	props:
 *		me:		boolean, true if user is watching it's own profile, false else
 *		login:	string, login of the stud
 */
const UserProfile = props => {
	const [stud, setStud] = useState();
	const [blackHole, setBlackHole] = useState();

	useEffect(() => {
		if (!props.login) return;
		fetch(`${process.env.REACT_APP_API_URL}/stud/${props.login}`, {
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
			.catch();
	}, [props]);

	if (props.login === undefined || stud === undefined)
		return (
			<div id={style.load}>
				<Loading />
			</div>
		);
	return (
		<div className={style.profileContainer}>
			<div className={style.profileInfoContainer}>
				<ProfilePicture stud={stud} />
				<Identity
					stud={stud}
					blackHole={blackHole}
					me={props.me}
					login={props.login}
				/>
				<QR login={props.login} />
			</div>
			<HistorySelector
				fields={[
					{
						content: (
							<SubscribedEvents
								login={props.login}
								me={props.me}
							/>
						),
						title: "Evenements"
					},
					{
						content: (
							<ContributionHistory
								login={props.login}
								setBlackHole={setBlackHole}
							/>
						),
						title: "Bientôt",
						disabled: true
						// title: "Cotisations"
					}
					// 	,
					// ...(props.me
					// 	? [
					// 			{
					// 				content: (
					// 					<OrderHistory login={props.login} />
					// 				),
					// 				title: "Commandes"
					// 			}
					// 	  ]
					// 	: [])
				]}
			/>
		</div>
	);
};

/*
 *	props:
 *		stud:	object, db data of the student
 */
const ProfilePicture = props => {
	return (
		<div className={style.profilePictureContainer}>
			<img
				src={props.stud.img_medium}
				className={props.stud.isPremium ? style.premium : ""}
			/>
			{props.stud.isPremium && (
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
					<defs>
						<linearGradient
							id="goldGrad"
							x1="0%"
							y1="0%"
							x2="100%"
							y2="0%"
						>
							<stop
								offset="0%"
								style={{
									stopColor: "var(--premium-gold-logo)",
									stopOpacity: 1
								}}
							/>
							<stop
								offset="50%"
								style={{
									stopColor: "var(--premium-gold)",
									stopOpacity: 1
								}}
							/>
							<stop
								offset="100%"
								style={{
									stopColor: "var(--premium-gold-logo)",
									stopOpacity: 1
								}}
							/>
						</linearGradient>
					</defs>
					<path
						d="M13.5,4l-3,3L7,2,3.5,7,.5,4v6.5A1.5,1.5,0,0,0,2,12H12a1.5,1.5,0,0,0,1.5-1.5Z"
						fill="url(#goldGrad)"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			)}
		</div>
	);
};

/*
 *	props:
 *		stud:	object, db data of the student
 */
const Identity = props => {
	return (
		<div className={style.identityContainer}>
			<h1>{props.stud.login}</h1>
			<ul>
				<li>
					{props.stud.firstname} {props.stud.lastname}
				</li>
				<li>
					Membre depuis le{" "}
					<b>
						{new Intl.DateTimeFormat("fr-FR", {
							day: "numeric",
							month: "short",
							year: "numeric"
						}).format(new Date(props.stud.joinDate))}
					</b>
				</li>
				<li hidden>
					Jours de cotisation restants :{" "}
					<b>{props.blackHole ? props.blackHole : 0}</b>
				</li>
				<li hidden>
					{props.blackHole > 0 ? (
						props.blackHole > 30 ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 14 14"
							>
								<path
									stroke="#000000"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M7 13.5C10.5899 13.5 13.5 10.5899 13.5 7C13.5 3.41015 10.5899 0.5 7 0.5C3.41015 0.5 0.5 3.41015 0.5 7C0.5 10.5899 3.41015 13.5 7 13.5Z"
								/>
								<path
									stroke="#000000"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3.7 8C4.2 9.8 6.2 10.9 8 10.4C9.1 10 10 9.1 10.3 8"
								/>
								<path
									stroke="#000000"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M4.8 5.45C4.66193 5.45 4.55 5.33807 4.55 5.2C4.55 5.06193 4.66193 4.95 4.8 4.95"
								/>
								<path
									stroke="#000000"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M4.8 5.45C4.93807 5.45 5.05 5.33807 5.05 5.2C5.05 5.06193 4.93807 4.95 4.8 4.95"
								/>
								<g>
									<path
										stroke="#000000"
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9.2 5.45C9.06193 5.45 8.95 5.33807 8.95 5.2C8.95 5.06193 9.06193 4.95 9.2 4.95"
									/>
									<path
										stroke="#000000"
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9.2 5.45C9.33807 5.45 9.45 5.33807 9.45 5.2C9.45 5.06193 9.33807 4.95 9.2 4.95"
									/>
								</g>
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 14 14"
							>
								<path
									stroke="#000000"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3.5 9.5H10.5"
								/>
								<path
									stroke="#000000"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M7 13.5C10.5899 13.5 13.5 10.5899 13.5 7C13.5 3.41015 10.5899 0.5 7 0.5C3.41015 0.5 0.5 3.41015 0.5 7C0.5 10.5899 3.41015 13.5 7 13.5Z"
								/>
								<path
									stroke="#000000"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M4.8 5.45C4.66193 5.45 4.55 5.33807 4.55 5.2C4.55 5.06193 4.66193 4.95 4.8 4.95"
								/>
								<path
									stroke="#000000"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M4.8 5.45C4.93807 5.45 5.05 5.33807 5.05 5.2C5.05 5.06193 4.93807 4.95 4.8 4.95"
								/>
								<g>
									<path
										stroke="#000000"
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9.2 5.45C9.06193 5.45 8.95 5.33807 8.95 5.2C8.95 5.06193 9.06193 4.95 9.2 4.95"
									/>
									<path
										stroke="#000000"
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9.2 5.45C9.33807 5.45 9.45 5.33807 9.45 5.2C9.45 5.06193 9.33807 4.95 9.2 4.95"
									/>
								</g>
							</svg>
						)
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 14 14"
						>
							<path
								stroke="#000000"
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M7 13.5C10.5899 13.5 13.5 10.5899 13.5 7C13.5 3.41015 10.5899 0.5 7 0.5C3.41015 0.5 0.5 3.41015 0.5 7C0.5 10.5899 3.41015 13.5 7 13.5Z"
							/>
							<path
								stroke="#000000"
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3.7 10.5C4.2 8.7 6.1 7.6 8 8.1C9.1 8.4 10 9.3 10.4 10.5"
							/>
							<path
								stroke="#000000"
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4.85 5.45C4.71193 5.45 4.6 5.33807 4.6 5.2C4.6 5.06193 4.71193 4.95 4.85 4.95"
							/>
							<path
								stroke="#000000"
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4.85 5.45C4.98807 5.45 5.1 5.33807 5.1 5.2C5.1 5.06193 4.98807 4.95 4.85 4.95"
							/>
							<g>
								<path
									stroke="#000000"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M9.24999 5.45C9.11192 5.45 8.99999 5.33807 8.99999 5.2C8.99999 5.06193 9.11192 4.95 9.24999 4.95"
								/>
								<path
									stroke="#000000"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M9.24999 5.45C9.38806 5.45 9.49999 5.33807 9.49999 5.2C9.49999 5.06193 9.38806 4.95 9.24999 4.95"
								/>
							</g>
						</svg>
					)}
				</li>
			</ul>
			{props.me && (
				<ChangeEmailField
					login={props.login}
					mail={props.stud.true_email}
				/>
			)}
		</div>
	);
};

/*
 *	props:
 *		login:	string, login of the stud
 */
const QR = props => {
	const [qr, setQr] = useState(false);
	return (
		<div className={style.qrContainer} hidden>
			<button
				onClick={() => {
					setQr(true);
				}}
			>
				Afficher le QR
			</button>
			{qr && (
				<div
					className={style.blurryBg}
					onClick={() => {
						setQr(false);
					}}
				>
					<div className={style.qrPopup}>
						<QRCodeSVG
							value={`http://${window.location.host}/profile/${props.login}`}
							bgColor="var(--white)"
							fgColor="var(--black)"
							level="H"
						/>
					</div>
				</div>
			)}
		</div>
	);
};

/*
 *	props:
 *		login:	string, login of the stud
 */
const ChangeEmailField = props => {
	const [trueMail, setTrueMail] = useState("");
	const [ogTrueMail, setOgTrueMail] = useState();

	const handleMailChange = event => {
		setTrueMail(event.target.value);
	};

	const saveMail = async () => {
		if (trueMail === "") return;
		await fetch(`${process.env.REACT_APP_API_URL}/stud/${props.login}`, {
			credentials: "include",
			method: "PATCH",
			body: JSON.stringify({
				true_email: trueMail
			}),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				setOgTrueMail(trueMail);
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	};

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/stud/${props.login}/mail`, {
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
			.then(data => {
				setTrueMail(data);
				setOgTrueMail(data);
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, [props]);

	return props.mail ? (
		<div className={style.emailFieldContainer}>
			<label>Email :</label>
			<input
				type="email"
				name="trueMail"
				id="emailField"
				value={trueMail}
				onChange={handleMailChange}
			/>
			<button
				onClick={() => {
					if (
						!document
							.getElementById("emailField")
							.checkValidity() ||
						!trueMail
							.split("@")[1]
							.split(".")[1]
							.startsWith("42")
					) {
						NotificationManager.warning(
							"Le mail entré est invalide",
							"Attention",
							5000
						);
					}
					if (trueMail === ogTrueMail) {
						NotificationManager.warning(
							"Le mail est déjà enregistré à cette valeur",
							"Attention",
							5000
						);
						return;
					}
					saveMail();
					NotificationManager.success(
						"Le mail a bien été enregistré",
						"Validation",
						5000
					);
				}}
			>
				Enregistrer
			</button>
		</div>
	) : (
		<></>
	);
};

/*
 *	props:
 *		login:	string, login of the stud
 */
const ContributionHistory = props => {
	const [page, setPage] = useState(1);
	const [count, setCount] = useState(0);
	const [data, setData] = useState([]);
	const viewData = usePagination(data, 3);

	const handleChangePage = (e, p) => {
		setPage(p);
		viewData.jump(p);
	};

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/contribution/${props.login}`, {
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
				setData(data);
				data.forEach((item, i) => {
					if (
						new Date(item.end_date) > Date.now() &&
						new Date(item.begin_date) <= Date.now()
					) {
						props.setBlackHole(
							Math.ceil(
								(new Date(item.end_date).getTime() -
									new Date(Date.now()).getTime()) /
									(1000 * 3600 * 24)
							)
						);
					}
				});
				setCount(Math.ceil(data.length / 3));
				viewData.updateData(data);
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, [props]);

	return (
		<div className={style.listContainer} id={style.contrib}>
			<h3> Historique des cotisations</h3>
			<div className={style.pagination}>
				{data.length > 3 && (
					<Pagination
						count={count}
						page={page}
						onChange={handleChangePage}
					/>
				)}
			</div>
			<ul id={style.malist}>
				{viewData.length ? (
					viewData.currentData().map(data => (
						<li key={data.id}>
							<div>
								<p>{`${new Date(
									data.begin_date
								).toLocaleDateString()} - ${new Date(
									data.end_date
								).toLocaleDateString()}`}</p>
								<p>
									{
										//text here
										[
											"Pas encore commencée",
											"En cours",
											"Echue"
										][
											+(
												new Date(data.begin_date) <
												new Date(Date.now())
											) +
												+(
													new Date(data.end_date) <
													new Date(Date.now())
												)
										]
									}
								</p>
							</div>
						</li>
					))
				) : (
					<div>Aucune cotisation active ou passée</div>
				)}
			</ul>
			<div className={style.pagination}>
				{data.length > 3 && (
					<Pagination
						count={count}
						page={page}
						onChange={handleChangePage}
					/>
				)}
			</div>
		</div>
	);
};

/*
 *	props:
 *		login:	string, login of the stud
 */
const SubscribedEvents = props => {
	const [page, setPage] = useState(1);
	const [count, setCount] = useState(0);
	const [data, setData] = useState([]);
	const viewData = usePagination(data, 3);

	const handleChangePage = (e, p) => {
		setPage(p);
		viewData.jump(p);
	};

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/event/stud/${props.login}`, {
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
				setData(data);
				setCount(Math.ceil(data.length / 3));
				viewData.updateData(data);
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, [props]);

	return (
		<div className={style.listContainer} id={style.event}>
			<h3> Évènements </h3>
			<div className={style.pagination}>
				{data.length > 3 && (
					<Pagination
						count={count}
						page={page}
						onChange={handleChangePage}
					/>
				)}
			</div>
			<ul id={style.eventList}>
				{viewData.length ? (
					viewData.currentData().map(data => (
						<li key={data.id}>
							<EventToken event={data} user />
						</li>
					))
				) : props.me ? (
					<div>Tu ne t'es inscrit à aucun évènement</div>
				) : (
					<div>
						{props.login} n'a encore participé à aucun évènement
					</div>
				)}
			</ul>
			<div className={style.pagination}>
				{data.length > 3 && (
					<Pagination
						count={count}
						page={page}
						onChange={handleChangePage}
					/>
				)}
			</div>
		</div>
	);
};

/*
 *	props:
 *		login:	string, login of the stud
 */
const OrderHistory = props => {
	const [page, setPage] = useState(1);
	const [count, setCount] = useState(0);
	const [data, setData] = useState([]);
	const viewData = usePagination(data, PER_PAGE);

	const handleChangePage = (e, p) => {
		setPage(p);
		viewData.jump(p);
	};

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/order/stud/${props.login}`, {
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
				setData(data);
				setCount(Math.ceil(data.length / PER_PAGE));
				viewData.updateData(data);
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, [props]);

	return (
		<div className={style.listContainer} id={style.order}>
			<h3> Commandes </h3>
			<div className={style.pagination}>
				{data.length > PER_PAGE && (
					<Pagination
						count={count}
						page={page}
						onChange={handleChangePage}
					/>
				)}
			</div>
			<ul id={style.MALISTE}>
				{viewData.length ? (
					viewData.currentData().map(data => (
						<li key={data.id}>
							<button
								className={
									style[
										data.type === -1
											? "cotisation"
											: "evenement"
									]
								}
								onClick={() => {
									window.location = `/receipt/${data.id}`;
								}}
							>
								{data.type === -1 ? "Cotisation" : "évènement"}{" "}
								<span style={{fontFamily: "monospace"}}>
									{data.id}
								</span>
							</button>
						</li>
					))
				) : (
					<div>Aucune commande passée</div>
				)}
			</ul>
			<div className={style.pagination}>
				{data.length > PER_PAGE && (
					<Pagination
						count={count}
						page={page}
						onChange={handleChangePage}
					/>
				)}
			</div>
		</div>
	);
};

/*
 *	props:
 *		fields:	[{content, title}]
 */
const HistorySelector = props => {
	const [selected, setSelected] = useState(0);

	if (props.fields.length === 0) return;
	return (
		<div
			className={style.historySelectorContainer}
			disabled={props.disable}
		>
			<div className={style.historySelector}>
				<ul>
					{props.fields.map((field, i) => (
						<li key={i}>
							<input
								disabled={field.disabled}
								id={`radio${i}`}
								type="radio"
								checked={selected === i}
								onChange={() => {
									setSelected(i);
								}}
							/>
							<label
								disabled={field.disabled}
								htmlFor={`radio${i}`}
							>
								{" "}
								{field.title}
							</label>
						</li>
					))}
				</ul>
			</div>
			<div className={style.historyContent}>
				{props.fields[selected].content}
			</div>
		</div>
	);
};

export default UserProfile;
