import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";

const AdminLogs = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/admin/logs`, {
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
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
	}, []);

	return (
		<div
			style={{
				display: "flex"
			}}
		>
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
