import React from "react";
import {useState, useEffect} from "react";
import QRCode from "react-qr-code";
import {Navigate} from "react-router-dom";
import {LazyLoadImage} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {Button} from "reactstrap";

import EventToken from "./EventToken";

import yellowStar from "../assets/logos/yellow_star.svg";
import greyStar from "../assets/logos/grey_star.svg";

const UserProfile = options => {
	const [dataStud, setDataStud] = useState({});
	const [dataContrib, setDataContrib] = useState([]);
	const [dataEvent, setDataEvent] = useState([]);
	const [contributionStatus, setContributionStatus] = useState(false);
	const [nav, setNav] = useState(<></>);

	//Stud
	useEffect(() => {
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

	//Contribs
	useEffect(() => {
		if (options.login !== "")
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
						src={`https://cdn.intra.42.fr/users/${dataStud.login}.jpg`}
						width="auto"
						effect="blur"
					/>
					<div>
						<h1>{dataStud.login}</h1>
						<h2>{`${dataStud.firstname} ${dataStud.lastname}`}</h2>
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
				<div style={{display: "flex"}}>
					<div>
						<h3> Historique de contributions</h3>
						<ul>
							{dataContrib.map(data => (
								<li key={data.id}>
									{`${new Date(
										data.begin_date
									).toLocaleDateString()} - ${new Date(
										data.end_date
									).toLocaleDateString()}`}
								</li>
							))}
						</ul>
					</div>
					<div>
						<h3> Events inscrits </h3>
						<ul>
							{dataEvent.map(data => (
								<li key={data.id}>
									<EventToken event={data} />
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</>
	);
};

export default UserProfile;
