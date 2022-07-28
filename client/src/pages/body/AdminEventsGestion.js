import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminEventToken from "../../components/AdminEventToken";
import AdminCreateEventToken from "../../components/AdminCreateEventToken";

import {Accordion, Button} from "react-bootstrap";

const AdminEventsGestion = param => {
	const [data, setData] = useState([]);
	const [openEventId, setOpenEventId] = useState(-42);
	const [update, setUpdate] = useState(false);
	const [newEvent, setNewEvent] = useState(<></>);

	useEffect(() => {
		setUpdate(false);
		const requestOptions = {
			method: "post",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			}, //add security token here i guess
			body: JSON.stringify(param.filter)
		};
		fetch(`http://localhost:4242/event/get`, requestOptions)
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
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [param.filter, openEventId, update]);

	const createNewEvent = () => {
		setNewEvent(
			<AdminCreateEventToken
				onClickRetract={() => setOpenEventId(-42)}
				onClickDeploy={() => setOpenEventId(-1)}
			/>
		);
		setOpenEventId(-1);
	};

	return (
		<>
			<AdminNavbar />
			<Button onClick={createNewEvent}>New</Button>
			<Accordion>
				{newEvent}
				{data.length ? (
					data.map((item, i) => (
						<Accordion.Item eventKey={i} key={i}>
							<AdminEventToken
								data={item}
								index={i}
								key={i}
								open={openEventId}
								onClickRetract={() => setOpenEventId(-42)}
								onClickDeploy={() => setOpenEventId(i)}
							/>
						</Accordion.Item>
					))
				) : (
					<div>No event created</div>
				)}
			</Accordion>
		</>
	);
};

export default AdminEventsGestion;
