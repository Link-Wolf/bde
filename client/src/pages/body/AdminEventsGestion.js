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
	const [ret, setRet] = useState(<></>);

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
		fetch(`http://${global.config.api.authority}/event/get`, requestOptions)
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
				cancel={() => setNewEvent(<></>)}
				setUpdate={d => {
					setUpdate(d);
					setNewEvent(<></>);
				}}
			/>
		);
		setOpenEventId(-1);
	};

	useEffect(() => {
		setRet(
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
						{data.map((item, i) => (
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
										setOpenEventId(-42); //RETRACT TOI BATAR
									}}
								/>
							</Accordion.Item>
						))}
					</Accordion>
				</div>
			</div>
		);
	}, [data]);

	return ret;
};
export default AdminEventsGestion;
