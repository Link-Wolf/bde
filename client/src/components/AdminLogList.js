import {useState, useEffect, React} from "react";

const AdminLogList = param => {
	const [data, setData] = useState([]);

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/admin/logs/get`, {
			credentials: "include",
			method: "post",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(param.filter)
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
	}, [param.filter]);

	return data.length ? (
		<div>
			{data.length > 0 && (
				<ul>
					{data.map(log => (
						<li key={log.id}>
							<ul>
								<li>{log.type}</li>
								<li>{log.login}</li>
								<li>{log.message}</li>
								<li>{log.date}</li>
							</ul>
						</li>
					))}
				</ul>
			)}
		</div>
	) : (
		<div>No logs available for this filters</div>
	);
};

export default AdminLogList;
