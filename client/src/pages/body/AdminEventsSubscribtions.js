import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";
import useConfirm from "../../components/useConfirm";

import {Form, Button, FormGroup} from "react-bootstrap";

const AdminStudents = () => {
	const {isConfirmed} = useConfirm();

	const [stud, setStud] = useState([]);
	const [allEvent, setAllEvent] = useState([]);
	const [selectedEvent, setSelectedEvent] = useState("");
	const [update, setUpdate] = useState(false);
	const [subForm, setSubForm] = useState(<></>);

	useEffect(() => {
		// TODO: get token
	}, []);

	const getStud = id => {
		fetch(`http://${global.config.api.authority}/inscription/${id}/stud`, {
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

	const checkStud = (eventId, login) => {
		const requestOptions = {
			method: "PATCH",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({login: login})
		};
		fetch(
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
			})
			.catch(function() {
				setUpdate(true);
			});
	};

	const updateSelectedEvent = event => {
		setSelectedEvent(event.target.value);
	};

	const handleRemoveButton = async event => {
		if (
			await isConfirmed(
				`Tu es certain de vouloir désinscrire ${event.target.value} de force ?`
			)
		) {
			removeStud(selectedEvent, event.target.value);
			setUpdate(true);
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

	useEffect(() => {
		setUpdate(false);

		const handleSubButton = async () => {
			let toSub = document.getElementById("studToAdd").value;
			if (
				await isConfirmed(
					`Tu es certain de vouloir inscrire ${toSub} de force ?`
				)
			) {
				if (toSub !== "") {
					checkStud(selectedEvent, toSub);
					toSub = 0;
				}
				setUpdate(true);
			}
		};

		if (selectedEvent !== "") {
			getStud(selectedEvent);
			setSubForm(
				<FormGroup>
					<Form.Label>
						Entrez le login du stud a inscrire de force (doit s'etre
						connecte au moins une fois)
					</Form.Label>
					<Form.Control
						type="text"
						id="studToAdd"
						placeholder="yoyostud"
						autoFocus={true}
					/>
					<Button value="button" onClick={handleSubButton}>
						Inscrire
					</Button>
				</FormGroup>
			);
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
									<option key={event.id} value={event.id}>
										{`${event.name} (${event.begin_date})`}
									</option>
								);
							})}
						</Form.Select>
					</Form>

					{subForm}

					{stud.length > 0 && (
						<ul>
							{stud.map(user => (
								<li key={user.login}>
									{user.login}
									<ul>
										<li>{user.firstname}</li>
										<li>{user.lastname}</li>
										<li>
											{user.isDirection
												? "direction"
												: "pnj"}
										</li>
										<Button
											value={user.login}
											onClick={handleRemoveButton}
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
