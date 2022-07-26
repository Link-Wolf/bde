import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";

const AdminContributions = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		fetch(`http://localhost:4242/contribution`, {credentials: "include"})
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(actualData => {
				setData(actualData);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, [token]);

	const createNewContrib = () => {
		fetch(`http://localhost:4242/contribution/admin`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				stud: "[login]",
				cost: 0,
				begin_date: new Date(Date.now()),
				cost: 0
			})
		});
		setUpdate(true);
	};

	return (
		<>
			<AdminNavbar />
			{data.length ? (
				<Accordion>
					{data.map((item, i) => (
						<Accordion.Item eventKey={i} key={i}>
							<AdminEventToken
								data={item}
								index={i}
								key={i}
								open={openEventId}
								onClickRetract={() => setOpenEventId(-1)}
								onClickDeploy={() => setOpenEventId(i)}
							/>
						</Accordion.Item>
					))}
				</Accordion>
			) : (
				<div>No event created</div>
			)}
			<Button onClick={createNewContrib}>New</Button>
		</>
	);
};

export default AdminContributions;
