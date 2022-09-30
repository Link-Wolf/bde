import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";
import useConfirm from "../../components/useConfirm";
import {NotificationManager} from "react-notifications";

import {Form, Button, FormGroup} from "react-bootstrap";

const AdminStudents = () => {
	const {isConfirmed} = useConfirm();

	const [stud, setStud] = useState([]);
	const [check, setCheck] = useState(false);
	const [allEvent, setAllEvent] = useState([]);
	const [selectedEvent, setSelectedEvent] = useState("");
	const [update, setUpdate] = useState(false);
	const [subForm, setSubForm] = useState(false);

	const getStud = id => {
		fetch(`http://${global.config.api.authority}/inscription/event/${id}`, {
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				if (response) return response.json();
			})
			.then(actualData => {
				setStud(actualData);
			})
			.catch(function(error) {
				setStud([]);
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	};

	const removeStud = (eventId, login) => {
		const requestOptions = {
			method: "DELETE",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			}
		};
		console.log(`login : ${login}`);
		fetch(
			`http://${global.config.api.authority}/inscription/${eventId}/${login}`,
			requestOptions
		)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				setUpdate(true);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	};

	const checkStud = async (eventId, login, eventCost) => {
		const requestOptions = {
			method: "PATCH",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({login: login, cost: eventCost})
		};
		return await fetch(
			`http://${global.config.api.authority}/event/admin/${eventId}/inscription`,
			requestOptions
		)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				setUpdate(true);
				return 1;
			})
			.catch(function() {
				setUpdate(true);
			});
	};

	const updateSelectedEvent = event => {
		setSelectedEvent(event.target.value);
	};

	const handleRemoveButton = async login => {
		if (
			await isConfirmed(
				`Tu es certain de vouloir désinscrire ${login} de force ?`
			)
		) {
			removeStud(selectedEvent, login);
			setUpdate(true);
			NotificationManager.success(
				`Successfully unsubscribe ${login}`,
				"Validation",
				3000
			);
		}
	};

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/event/current`, {
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
			.then(actualData => {
				setAllEvent(actualData);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, []);

	const handleSubButton = async () => {
		let toSub = document.getElementById("studToAdd").value;
		let cost = document.getElementById("cost").value;
		let confirm = await isConfirmed(
			`Tu es certain de vouloir inscrire ${toSub} de force ?`
		);
		if (confirm) {
			if (toSub !== "") {
				const check = await checkStud(selectedEvent, toSub, cost);
				console.log(check);
				if (check == 1) {
					NotificationManager.success(
						`Successfully subscribe ${toSub}`,
						"Validation",
						3000
					);
					toSub = 0;
					//vider form;
				} else {
					NotificationManager.error(
						`Login ${toSub} does not exist is already subscribe to the selected event`,
						"Validation",
						3000
					);
				}
			}
			setUpdate(true);
		}
	};

	useEffect(() => {
		setUpdate(false);

		if (selectedEvent !== "") {
			getStud(selectedEvent);
			setSubForm(true);
		}
	}, [selectedEvent, update]);
	return (
		<div
			style={{
				display: "flex"
			}}
		>
			<AdminNavbar />
			<div>
				<h1> AdminPannel </h1>
				<div>
					<Form>
						Event :
						<Form.Select
							onChange={updateSelectedEvent}
							value={selectedEvent}
						>
							<option value="" disabled hidden>
								Choose here
							</option>
							{allEvent.map(event => {
								return (
									<option
										key={event.id}
										value={event.id}
										id={`event_${event.id}`}
										event={event}
									>
										{`${event.name} (${event.begin_date})`}
									</option>
								);
							})}
						</Form.Select>
					</Form>

					{subForm ? (
						<FormGroup>
							<Form.Label>
								Entrez le login du stud a inscrire de force (iel
								doit s'etre connecte au moins une fois) et le
								prix qu'iel a payé.
							</Form.Label>
							<Form.Control
								type="text"
								id="studToAdd"
								placeholder="Login"
								autoFocus={true}
							/>
							<Form.Control
								type="number"
								id="cost"
								placeholder="Prix"
								autoFocus={true}
							/>
							<p>
								Il reste{" "}
								{allEvent.find(event => {
									return event.id == selectedEvent;
								}).nb_places !== -42
									? allEvent.find(event => {
											return event.id == selectedEvent;
									  }).nb_places
									: "∞"}{" "}
								places normales dont{" "}
								{
									allEvent.find(event => {
										return event.id == selectedEvent;
									}).nb_premium_places
								}{" "}
								places premiums.
							</p>
							<Button value="button" onClick={handleSubButton}>
								Inscrire
							</Button>
						</FormGroup>
					) : (
						<></>
					)}

					{stud.length > 0 && (
						<ul>
							{stud.map(user => (
								<li key={user.studLogin}>
									{user.studLogin}
									<ul>
										<li>{user.price}€</li>
										<li>{user.date}</li>
										<Button
											onClick={() => {
												handleRemoveButton(
													user.studLogin
												);
											}}
										>
											❌
										</Button>
									</ul>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};

export default AdminStudents;
