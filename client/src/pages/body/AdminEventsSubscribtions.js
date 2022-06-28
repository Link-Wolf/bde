import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";

const AdminStudents = () => {
	const [dataEvent, setDataEvent] = useState([]);
	const [stud, setStud] = useState([]);

	getStud(() => {
		fetch(`http://localhost:4242/inscription/event/${id}`)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(actualData => {
				setStud(actualData);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	});

	removeStud(() => {
		fetch(`http://localhost:4242/stud/${login}`)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(actualData => {
				fetch(`http://localhost:4242/stud/${actualData}`) //delete
					.then(response => {
						if (!response.ok) {
							throw new Error(
								`This is an HTTP error: The status is ${response.status}`
							);
						}
					})
					.catch(function(error) {
						console.log(
							`This is a fetch error: The error is ${error.message}`
						);
					});
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	});

	checkStud(() => {
		fetch(`http://localhost:4242/inscription/event/${id}`)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(actualData => {
				setDataStud(actualData);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	});

	getAllEvent(() => {
		fetch(`http://localhost:4242/event/current`)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(actualData => {
				setDataStud(actualData);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	});

	useEffect(() => {
		if (!eventPreload) {
			getAllEvent();
			setEventPreload(true);
		}
	}, []);

	return (
		<div>
			<AdminNavbar />
			<div>
				<h1> AdminPannel </h1>
				<div>
					<form>
						<select>
							{allEvent.map(event => {
								return <option>{event.name}</option>;
							})}
						</select>
					</form>
					{data.length > 0 && (
						<ul>
							{dataStud.map(user => (
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
										<li> ❌ </li>
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
