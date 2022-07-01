import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminEventToken from "../../components/AdminEventToken";

import {Accordion, Button} from "react-bootstrap";

const AdminEventsGestion = param => {
	const [data, setData] = useState([]);
	const [openEventId, setOpenEventId] = useState(-1);
	const [update, setUpdate] = useState(false);

	useEffect(() => {
		setUpdate(false);
		const requestOptions = {
			method: "post",
			headers: {"Content-Type": "application/json"}, //add security token here i guess
			body: JSON.stringify(param.filter)
		};
		fetch(`http://k1r2p10.42mulhouse.fr:4242/event/get`, requestOptions)
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
		fetch("http://k1r2p10.42mulhouse.fr:4242/event", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				name: "[nom]",
				cost: 0,
				nb_places: -42,
				begin_date: new Date(Date.now()),
				isOutside: false,
				consos: false,
				place: "[lieu]",
				desc: "[description]",
				sponso: false
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
			<Button onClick={createNewEvent}>New</Button>
		</>
	);
};

export default AdminEventsGestion;
