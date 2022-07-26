import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";

const AdminContributions = () => {
	const [data, setData] = useState([]);
	const [token, setToken] = useState("");

	useEffect(() => {
		// TODO: get setToken
	}, []);

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

	return (
		<div>
			<AdminNavbar />
			<div>
				<h1> AdminPannel Contributions part </h1>
				<div>
					{data.length > 0 && (
						<ul>
							{data.map(contrib => (
								<li key={contrib.studLogin}>
									{contrib.studLogin}
									<ul>
										<li> {contrib.cost} </li>
										<li> {contrib.begin_date} </li>
										<li>{contrib.end_date}</li>
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

export default AdminContributions;
