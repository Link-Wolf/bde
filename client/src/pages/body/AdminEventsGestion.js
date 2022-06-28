import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";

const AdminEventsGestion = param => {
	const [data, setData] = useState([]);

	useEffect(() => {
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
	}, [param.filter]);

	return (
		<div>
			<AdminNavbar />
			{data.length ? (
				<div>
					{data.map(item => (
						<li key={item.id}>
							<h2>{item.name}</h2>
							<ul>
								{item.cost ? <li>item.cost</li> : null}
								{item.premium_cost !== item.cost ? (
									<li>item.premium_cost</li>
								) : null}
								<li>{item.place}</li>

								<li>{item.nb_places}</li>
								<li>{item.consos ? "Consos" : "Pas consos"}</li>
								<li>
									{item.isOutside ? "Dehors" : "Pas dehors"}
								</li>
								<li>{item.desc}</li>
								<li>{item.begin_date}</li>
								<li>
									{item.end_date
										? item.end_date
										: "Permanent"}
								</li>
							</ul>
						</li>
					))}
				</div>
			) : (
				<div>No event created</div>
			)}
		</div>
	);
};

export default AdminEventsGestion;
