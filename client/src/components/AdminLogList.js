import {useState, useEffect, React} from "react";
import usePagination from "./Pagination";
import {Pagination} from "@mui/material";

const AdminLogList = param => {
	const PER_PAGE = 21;
	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);
	const [count, setCount] = useState(0);
	const viewData = usePagination(data, PER_PAGE);
	const [load, setLoad] = useState(false);

	useEffect(() => {
		setLoad(true);
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
				setCount(Math.ceil(actualData.length / PER_PAGE));
				viewData.updateData(actualData);
				setLoad(false);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, [param.filter]);

	const handleChangePage = (e, p) => {
		setPage(p);
		viewData.jump(p);
	};

	return load ? (
		<div>Chargement ...</div>
	) : data.length ? (
		<div>
			<Pagination count={count} page={page} onChange={handleChangePage} />
			{data.length > 0 && (
				<ul>
					{viewData.currentData().map(log => (
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
			<Pagination count={count} page={page} onChange={handleChangePage} />
		</div>
	) : (
		<div>No logs available for this filters</div>
	);
};

export default AdminLogList;
