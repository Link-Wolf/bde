import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminEventToken from "../../components/AdminEventToken";

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
				console.log(actualData);
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
		fetch("http://localhost:4242/event", {
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
				desc: "[description]"
			})
		});
		setUpdate(true);
	};

	return (
		<div>
			<AdminNavbar />
			{data.length ? (
				<div>
					{data.map((item, i) => (
						<AdminEventToken
							data={item}
							index={i}
							key={i}
							open={openEventId}
							onClickRetract={() => setOpenEventId(-1)}
							onClickDeploy={() => setOpenEventId(i)}
						/>
					))}
				</div>
			) : (
				<div>No event created</div>
			)}
			<button onClick={createNewEvent}>New</button>
		</div>
	);
};

export default AdminEventsGestion;
