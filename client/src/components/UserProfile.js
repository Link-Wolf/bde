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

import EventToken from "./EventToken";

import yellowStar from "../assets/logos/yellow_star.svg";
import greyStar from "../assets/logos/grey_star.svg";

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
	const [contributionStatus, setContributionStatus] = useState(false);
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
						setContributionStatus(true);
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
				<div style={{display: "flex"}}>
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
					<div>
						<h1>
							{dataStud.login === undefined ? "" : dataStud.login}
						</h1>
						<h2>
							{dataStud.login === undefined
								? ""
								: `${dataStud.firstname} ${dataStud.lastname}`}
						</h2>
					</div>
					<a
						href={`http://${window.location.host}/profile/${dataStud.login}`}
					>
						<QRCode
							value={`http://${window.location.host}/profile/${dataStud.login}`}
							level="H"
						/>
					</a>
				</div>
				<div style={{display: "flex"}}>
					<LazyLoadImage
						height="50px"
						src={contributionStatus ? yellowStar : greyStar}
						width="auto"
						effect="blur"
					/>
					<p style={{fontSize: "40px"}}>
						{contributionStatus
							? "Is a premium member"
							: "Is just a stud"}
					</p>
					<LazyLoadImage
						height="50px"
						src={contributionStatus ? yellowStar : greyStar}
						width="auto"
						effect="blur"
					/>
				</div>
				<div>
					{!contributionStatus && options.canSub ? (
						<Button color="primary" href="/contribute">
							Contribuer
						</Button>
					) : (
						""
					)}
				</div>
				<div>
					{!dataStud.true_email ? (
						<></>
					) : (
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
								Sauvegarder
							</button>
						</>
					)}
				</div>
				<div style={{display: "flex"}}>
					<div>
						<h3> Historique de contributions</h3>
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
					<div>
						<h3> Events inscrits </h3>
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
						<div>
							<h3> Historique commandes </h3>
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
		</>
	);
};

export default UserProfile;
