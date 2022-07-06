import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";
import {ReactSession} from "react-client-session";

const AdminLogs = () => {
	const [data, setData] = useState([]);
	const [token, setToken] = useState("");

	useEffect(() => {
		try {
			setToken(ReactSession.get("token"));
		} catch {
			setToken("");
		}
	}, []);

	useEffect(() => {
		fetch(`http://k1r2p10.42mulhouse.fr:4242/admin/logs`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`
			}
		})
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
				<h1> AdminPannel </h1>
				<div>
					{data.length > 0 && (
						<ul>
							{data.map(log => (
								<li key={log.id}>
									{log.id}
									<ul>
										<li>{log.type}</li>
										<li>{log.message}</li>
										<li>{log.date}</li>
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

export default AdminLogs;
