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

	if (props.login === undefined || stud === undefined) return <Loading />;
	return (
		<div className={style.profileContainer}>
			<div className={style.profileInfoContainer}>
				<ProfilePicture stud={stud} />
				<Identity stud={stud} blackHole={blackHole} />
				<QR login={props.login} />
			</div>
			{props.me && <ChangeEmailField login={props.login} />}
			<HistorySelector
				fields={[
					{
						content: (
							<ContributionHistory
								login={props.login}
								setBlackHole={setBlackHole}
							/>
						),
						title: "Contributions" // TODO: text here
					},
					{
						content: <SubscribedEvents login={props.login} />,
						title: "Evenements" // TODO: text here
					},
					...(props.me
						? [
								{
									content: (
										<OrderHistory login={props.login} />
									),
									title: "Commandes" // TODO: text here
								}
						  ]
						: [])
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
			<LazyLoadImage
				effect="blur"
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
	// TODO: text here
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
				<li>
					Jours de cotisation restants :{" "}
					<b>{props.blackHole ? props.blackHole : 0}</b>
				</li>
				<li>
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
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
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
						!document
							.getElementById("emailField")
							.checkValidity() ||
						!trueMail
							.split("@")[1]
							.split(".")[1]
							.startsWith("42")
					) {
						NotificationManager.warning(
							"Mail invalide", // TODO: words here
							"Attention",
							5000
						);
					}
					if (trueMail === ogTrueMail) {
						NotificationManager.warning(
							"Mail déjà enregistré à cette valeur",
							"Attention",
							5000
						);
						return;
					}
					saveMail();
					NotificationManager.success(
						"Mail biem enregistré", // TODO: words here
						"Validation",
						5000
					);
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
	const [page, setPage] = useState();
	const [count, setCount] = useState();
	const [data, setData] = useState([]);
	const viewData = usePagination(data, PER_PAGE);

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
				setCount(Math.ceil(data.length / PER_PAGE));
				viewData.updateData(data);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [props]);

	return (
		<div className={style.contrib}>
			<h3> Cotisations</h3>
			{data.length > PER_PAGE && (
				<Pagination
					count={count}
					page={page}
					onChange={handleChangePage}
				/>
			)}{" "}
			<ul>
				{viewData.currentData().map(data => (
					<li key={data.id}>
						{`${new Date(
							data.begin_date
						).toLocaleDateString()} - ${new Date(
							data.end_date
						).toLocaleDateString()}`}
					</li>
				))}
			</ul>
			{data.length > PER_PAGE && (
				<Pagination
					count={count}
					page={page}
					onChange={handleChangePage}
				/>
			)}{" "}
		</div>
	);
};

/*
 *	props:
 *		login:	string, login of the stud
 */
const SubscribedEvents = props => {
	const [page, setPage] = useState();
	const [count, setCount] = useState();
	const [data, setData] = useState([]);
	const viewData = usePagination(data, PER_PAGE);

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
				setCount(Math.ceil(data.length / PER_PAGE));
				viewData.updateData(data);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [props]);

	return (
		<div className={style.event}>
			<h3> Évènements </h3>
			{data.length > PER_PAGE && (
				<Pagination
					count={count}
					page={page}
					onChange={handleChangePage}
				/>
			)}{" "}
			<ul>
				{viewData.currentData().map(data => (
					<li key={data.id}>
						<EventToken event={data} />
					</li>
				))}
			</ul>
			{data.length > PER_PAGE && (
				<Pagination
					count={count}
					page={page}
					onChange={handleChangePage}
				/>
			)}{" "}
		</div>
	);
};

/*
 *	props:
 *		login:	string, login of the stud
 */
const OrderHistory = props => {
	const [page, setPage] = useState();
	const [count, setCount] = useState();
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
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [props]);

	return (
		<div className={style.orderHist}>
			<h3> Commandes </h3>
			{data.length > PER_PAGE && (
				<Pagination
					count={count}
					page={page}
					onChange={handleChangePage}
				/>
			)}{" "}
			<ul>
				{viewData.currentData().map(data => (
					<li key={data.id}>
						<button href={`/receipt/${data.id}`}>{data.id}</button>
					</li>
				))}
			</ul>
			{data.length > PER_PAGE && (
				<Pagination
					count={count}
					page={page}
					onChange={handleChangePage}
				/>
			)}{" "}
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
		<div className={style.historySelectorContainer}>
			<div className={style.historySelector}>
				<ul>
					{props.fields.map((field, i) => (
						<li key={i}>
							<input
								id={`radio${i}`}
								type="radio"
								checked={selected === i}
								onChange={() => {
									setSelected(i);
								}}
							/>
							<label htmlFor={`radio${i}`}> {field.title}</label>
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
		fetch(`${process.env.REACT_APP_API_URL}/stud/${options.login}`, {
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
			`${process.env.REACT_APP_API_URL}/stud/${options.login}/mail`,
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
				`${process.env.REACT_APP_API_URL}/stud/${options.login}`,
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
			`${process.env.REACT_APP_API_URL}/contribution/${options.login}`,
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
			`${process.env.REACT_APP_API_URL}/event/stud/${dataStud.login}`,
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
			`${process.env.REACT_APP_API_URL}/order/stud/${dataStud.login}`,
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
