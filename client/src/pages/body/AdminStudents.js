import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";

const AdminStudents = () => {
	const [data, setData] = useState([]);
	const [token, setToken] = useState("");

	useEffect(() => {
// TODO: get setToken
	}, []);

	useEffect(() => {
		fetch(`http://localhost:4242/stud`)
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
				<h1> AdminPannel Students part</h1>
				<div>
					{data.length > 0 && (
						<ul>
							{data.map(user => (
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
