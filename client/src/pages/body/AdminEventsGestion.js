import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminEventToken from "../../components/AdminEventToken";
import AdminCreateEventToken from "../../components/AdminCreateEventToken";
import {NotificationManager} from "react-notifications";

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
			},
			body: JSON.stringify(param.filter)
		};
		fetch(`${process.env.REACT_APP_API_URL}/event/get`, requestOptions)
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
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, [param.filter, openEventId, update]);

	const createNewEvent = () => {
		setNewEvent(
			<AdminCreateEventToken
				onClickRetract={() => setOpenEventId(-42)}
				onClickDeploy={() => setOpenEventId(-1)}
				cancel={() => setNewEvent(<></>)}
				setUpdate={d => {
					setUpdate(d);
					setNewEvent(<></>);
				}}
			/>
		);
		setOpenEventId(-1);
	};

	return (
		<div
			style={{
				display: "flex"
			}}
		>
			<AdminNavbar />
			<div>
				<Button onClick={createNewEvent}>New</Button>
				<Accordion>
					{newEvent}
					{data.map((item, i) => {
						return (
							<Accordion.Item eventKey={i} key={i}>
								<AdminEventToken
									data={item}
									index={i}
									key={i}
									open={openEventId}
									onClickRetract={() => setOpenEventId(-42)}
									onClickDeploy={() => setOpenEventId(i)}
									setUpdate={d => {
										setUpdate(d);
									}}
								/>
							</Accordion.Item>
						);
					})}
				</Accordion>
			</div>
		</div>
	);
};
export default AdminEventsGestion;
