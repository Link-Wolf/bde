import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";

const AdminStudents = () => {
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
				<div className={style.scroll_container_40vw}>
					{data.map(item => (
						<li key={item.id}>
							<h2>{item.name}</h2>
							<ul>
								<li>{item.cost ? item.cost : null}</li>
								<li>
									{item.premium_cost !== item.cost
										? item.premium_cost
										: null}
								</li>
								<li>{item.place}</li>
								<li>{item.nb_places}</li>
								<li>{item.consos}</li>
								<li>{item.isOutside}</li>
								<li>{item.desc}</li>
								<li>{item.begin_date}</li>
								<li>{item.end_date}</li>
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

export default AdminStudents;
