import React from "react";
import {useState, useEffect} from "react";
import QRCode from "react-qr-code";
import {Navigate} from "react-router-dom";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {NotificationManager} from "react-notifications";
import "react-lazy-load-image-component/src/effects/blur.css";
import {Button} from "reactstrap";
import usePagination from "./Pagination";
import {Pagination} from "@mui/material";
import style from "../style/UserProfile.module.scss";

import EventToken from "./EventToken";
import Loading from "./Loading";

/*
 *	props:
 *		me:		boolean, true if user is watching it's own profile, false else
 *		login:	string, login of the stud
 */
const UserProfile = props => {
	const [stud, setStud] = useState(undefined);

	useEffect(() => {
		if (!props.login) return;
		fetch(`http://${global.config.api.authority}/stud/${props.login}`, {
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

	if (props.login === undefined || stud === undefined) return <Loading />;
	return (
		<div className={style.profileContainer}>
			<div className={style.profileInfoContainer}>
				<ProfilePicture stud={stud} />
				<Identity stud={stud} />
				<QR login={props.login} />
			</div>
			{props.me && <ChangeEmailField login={props.login} />}
			<div className={style.historicContainer}>
				<ContributionHistory login={props.login} />
				<SubscribedEvents login={props.login} />
				{props.me && <OrderHistory login={props.login} />}
			</div>
		</div>
	);
};

/*
 *	props:
 *		stud:	object, db data of the student
 */ const ProfilePicture = props => {
	return (
		<div className={style.profilePictureContainer}>
			<img
				src={`https://cdn.intra.42.fr/users/${props.stud.login}.jpg`}
				className={props.stud.isPremium && style.premium}
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
									"stop-color": "var(--premium-gold-logo)",
									"stop-opacity": 1
								}}
							/>
							<stop
								offset="50%"
								style={{
									"stop-color": "var(--premium-gold)",
									"stop-opacity": 1
								}}
							/>
							<stop
								offset="100%"
								style={{
									"stop-color": "var(--premium-gold-logo)",
									"stop-opacity": 1
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
					{new Intl.DateTimeFormat("fr-FR", {
						day: "numeric",
						month: "short",
						year: "numeric"
					}).format(new Date(props.stud.joinDate))}
				</li>
			</ul>
		</div>
	);
};

/*
 *	props:
 *		login:	string, login of the stud
 */
const QR = props => {
	return (
		<div className={style.qrContainer}>
			<a href={`http://${window.location.host}/profile/${props.login}`}>
				<QRCode
					value={`http://${window.location.host}/profile/${props.login}`}
					level="H"
					bgColor="var(--white)"
					fgColor="var(--black)"
					size={256}
					viewBox={`0 0 256 256`}
				/>
			</a>
		</div>
	);
};

/*
 *	props:
 *		login:	string, login of the stud
 */
const ChangeEmailField = props => {
	const [trueMail, setTrueMail] = useState("");

	const handleMailChange = event => {
		setTrueMail(event.target.value);
	};

	const saveMail = async () => {
		if (trueMail !== "") {
			await fetch(
				`http://${global.config.api.authority}/stud/${props.login}`,
				{
					credentials: "include",
					method: "PATCH",
					body: JSON.stringify({
						true_email: trueMail
					}),
					headers: {
						"Content-Type": "application/json"
					}
				}
			)
				.then(response => {
					if (!response.ok) {
						throw new Error(
							`This is an HTTP error: The status is ${response.status}`
						);
					}
				})
				.catch(function(error) {
					console.log(
						"Il y a eu un problème avec l'opération fetch: " +
							error.message
					);
				});
		}
	};

	useEffect(() => {
		fetch(
			`http://${global.config.api.authority}/stud/${props.login}/mail`,
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
				return response.text();
			})
			.then(data => {
				setTrueMail(data);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [props]);

	return (
		<div className={style.emailFieldContainer}>
			Mon email :
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
						!(
							document
								.getElementById("emailField")
								.checkValidity() &&
							document
								.getElementById("emailField")
								.value.split("@")[1]
								.split(".")[1]
								.startsWith("42")
						)
					) {
						if (
							document.getElementById("emailField").value !==
							trueMail
						)
							saveMail();
						else {
							NotificationManager.warning(
								"Mail déjà enregistré à cette valeur",
								"Attention",
								5000
							);
						}
					}
				}}
			>
				Enregistrer
			</button>
		</div>
	);
};

/*
 *	props:
 *		login:	string, login of the stud
 */
const ContributionHistory = props => {
	return <div className={style.contribHistContainer}>Tes contribs</div>;
};

/*
 *	props:
 *		login:	string, login of the stud
 */
const SubscribedEvents = props => {
	return <div className={style.subEventsContainer}>Tes events</div>;
};

/*
 *	props:
 *		login:	string, login of the stud
 */
const OrderHistory = props => {
	return <div className={style.orderHist}>Tes commandes</div>;
};

/*
const UserProfile = options => {
	const PER_PAGE = 6;
	const [dataStud, setDataStud] = useState({});
	const [dataContrib, setDataContrib] = useState([]);
	const [pageContrib, setPageContrib] = useState(1);
	const [countContrib, setCountContrib] = useState(0);
	const viewDataContrib = usePagination(dataContrib, PER_PAGE);
	const [dataEvent, setDataEvent] = useState([]);
	const [pageEvent, setPageEvent] = useState(1);
	const [countEvent, setCountEvent] = useState(0);
	const viewDataEvent = usePagination(dataEvent, PER_PAGE);
	const [dataOrder, setDataOrder] = useState([]);
	const [pageOrder, setPageOrder] = useState(1);
	const [countOrder, setCountOrder] = useState(0);
	const viewDataOrder = usePagination(dataOrder, PER_PAGE);
	const [contributionStatus, setContributionStatus] = useState(-1);
	const [nav, setNav] = useState(<></>);
	const [trueMail, setTrueMail] = useState("");

	const handleChangePageContrib = (e, p) => {
		setPageContrib(p);
		viewDataContrib.jump(p);
	};

	const handleChangePageEvent = (e, p) => {
		setPageEvent(p);
		viewDataEvent.jump(p);
	};

	const handleChangePageOrder = (e, p) => {
		setPageOrder(p);
		viewDataOrder.jump(p);
	};

	//Stud
	useEffect(() => {
		if (options.login === undefined || options.login === "") return;
		fetch(`http://${global.config.api.authority}/stud/${options.login}`, {
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) {
					setNav(<Navigate to="/home" />);
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(data => {
				setDataStud(data);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [options]);

	useEffect(() => {
		if (options.login === undefined || options.login === "") return;
		fetch(
			`http://${global.config.api.authority}/stud/${options.login}/mail`,
			{
				credentials: "include"
			}
		)
			.then(response => {
				if (!response.ok) {
					setNav(<Navigate to="/home" />);
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.text();
			})
			.then(data => {
				setTrueMail(data);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [options]);

	const handleMailChange = event => {
		setTrueMail(event.target.value);
	};

	const saveMail = async () => {
		if (trueMail !== "") {
			await fetch(
				`http://${global.config.api.authority}/stud/${options.login}`,
				{
					credentials: "include",
					method: "PATCH",
					body: JSON.stringify({
						true_email: trueMail
					}),
					headers: {
						"Content-Type": "application/json"
					}
				}
			)
				.then(response => {
					if (!response.ok) {
						throw new Error(
							`This is an HTTP error: The status is ${response.status}`
						);
					}
				})
				.catch(function(error) {
					console.log(
						"Il y a eu un problème avec l'opération fetch: " +
							error.message
					);
				});
		}
	};

	//Contribs
	useEffect(() => {
		if (options.login === undefined || options.login === "") return;
		fetch(
			`http://${global.config.api.authority}/contribution/${options.login}`,
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
				setDataContrib(data);
				data.forEach((item, i) => {
					if (
						new Date(item.end_date) > Date.now() &&
						new Date(item.begin_date) <= Date.now()
					) {
						setContributionStatus(
							Math.ceil(
								(new Date(item.end_date).getTime() -
									new Date(Date.now()).getTime()) /
									(1000 * 3600 * 24)
							)
						);
					}
				});
				setCountContrib(Math.ceil(data.length / PER_PAGE));
				viewDataContrib.updateData(data);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [options]);

	//Events
	useEffect(() => {
		if (dataStud.login === undefined || dataStud.login === "") return;
		const requestOptions = {
			method: "get",
			credentials: "include"
		};
		fetch(
			`http://${global.config.api.authority}/event/stud/${dataStud.login}`,
			requestOptions
		)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(actualData => {
				setDataEvent(actualData);
				setCountEvent(Math.ceil(actualData.length / PER_PAGE));
				viewDataEvent.updateData(actualData);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [dataStud]);

	//Orders
	useEffect(() => {
		if (dataStud.login === undefined || dataStud.login === "") return;
		const requestOptions = {
			method: "get",
			credentials: "include"
		};
		fetch(
			`http://${global.config.api.authority}/order/stud/${dataStud.login}`,
			requestOptions
		)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(actualData => {
				setDataOrder(actualData);
				setCountOrder(Math.ceil(actualData.length / PER_PAGE));
				viewDataOrder.updateData(actualData);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [dataStud]);

	return (
		<>
			{nav}
			<div>
				<div className={style.recap}>
					<LazyLoadImage
						height="100px"
						src={
							dataStud.login === undefined
								? ""
								: `https://cdn.intra.42.fr/users/${dataStud.login}.jpg`
						}
						width="auto"
						effect="blur"
					/>
					<div className={style.name}>
						<h1>
							{dataStud.login === undefined ? "" : dataStud.login}
						</h1>
						<h2>
							{dataStud.login === undefined
								? ""
								: `${dataStud.firstname} ${dataStud.lastname}`}
						</h2>
					</div>
					<div className={style.qr}>
						<a
							href={`http://${window.location.host}/profile/${dataStud.login}`}
						>
							<QRCode
								value={`http://${window.location.host}/profile/${dataStud.login}`}
								level="H"
							/>
						</a>
					</div>
				</div>
				<div className={style.cotis}>
					<LazyLoadImage
						height="50px"
						src={contributionStatus >= 0 ? yellowStar : greyStar}
						width="auto"
						effect="blur"
					/>
					<p style={{fontSize: "40px"}}>
						{contributionStatus >= 0
							? `Cotisation active (${contributionStatus} jours restants)`
							: "Aucune cotisation en cours"}
					</p>
					<LazyLoadImage
						height="50px"
						src={contributionStatus >= 0 ? yellowStar : greyStar}
						width="auto"
						effect="blur"
					/>
				</div>
				<div className={style.cotiser}>
					{!contributionStatus >= 0 && options.canSub ? (
						<Button color="primary" href="/contribute">
							Cotiser
						</Button>
					) : (
						""
					)}
				</div>
				<div className={style.mail}>
					{!dataStud.true_email ? (
						<></>
					) : options.command_history ? (
						<>
							Mon email :
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
										!(
											document
												.getElementById("emailField")
												.checkValidity() &&
											document
												.getElementById("emailField")
												.value.split("@")[1]
												.split(".")[1]
												.startsWith("42")
										)
									) {
										if (
											document.getElementById(
												"emailField"
											).value !== trueMail
										)
											saveMail();
										else {
											NotificationManager.warning(
												"Mail déjà enregistré à cette valeur",
												"Attention",
												5000
											);
										}
									}
								}}
							>
								Enregistrer
							</button>
						</>
					) : (
						<></>
					)}
				</div>
				<div>
					Historique
					<div className={style.histo}>
						<div className={style.contribs}>
							<h3> Cotisations</h3>
							<Pagination
								count={countContrib}
								page={pageContrib}
								onChange={handleChangePageContrib}
							/>
							<ul>
								{viewDataContrib.currentData().map(data => (
									<li key={data.id}>
										{`${new Date(
											data.begin_date
										).toLocaleDateString()} - ${new Date(
											data.end_date
										).toLocaleDateString()}`}
									</li>
								))}
							</ul>
							<Pagination
								count={countContrib}
								page={pageContrib}
								onChange={handleChangePageContrib}
							/>
						</div>
						<div className={style.events}>
							<h3> Évènements </h3>
							<Pagination
								count={countEvent}
								page={pageEvent}
								onChange={handleChangePageEvent}
							/>
							<ul>
								{viewDataEvent.currentData().map(data => (
									<li key={data.id}>
										<EventToken event={data} />
									</li>
								))}
							</ul>
							<Pagination
								count={countEvent}
								page={pageEvent}
								onChange={handleChangePageEvent}
							/>
						</div>
						{options.command_history ? (
							<div className={style.orders}>
								<h3> Commandes </h3>
								<Pagination
									count={countOrder}
									page={pageOrder}
									onChange={handleChangePageOrder}
								/>
								<ul>
									{viewDataOrder.currentData().map(data => (
										<li key={data.id}>
											<a href={`/receipt/${data.id}`}>
												{data.id}
											</a>
										</li>
									))}
								</ul>
								<Pagination
									count={countOrder}
									page={pageOrder}
									onChange={handleChangePageOrder}
								/>
							</div>
						) : (
							<></>
						)}
					</div>
				</div>
			</div>
		</>
	);
};
*/

export default UserProfile;
