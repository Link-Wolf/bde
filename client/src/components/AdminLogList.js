import {useState, useEffect, React} from "react";
import usePagination from "./Pagination";
import {Pagination} from "@mui/material";
import {NotificationManager} from "react-notifications";

const AdminLogList = param => {
	const PER_PAGE = 21;
	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);
	const [count, setCount] = useState(0);
	const viewData = usePagination(data, PER_PAGE);
	const [load, setLoad] = useState(false);

	useEffect(() => {
		setLoad(true);
		fetch(`${process.env.REACT_APP_API_URL}/admin/logs/get`, {
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
				viewData.updateData(actualData);
				let tmp = Math.ceil(actualData.length / PER_PAGE);
				return tmp;
			})
			.then(tmp => {
				if (tmp < count) {
					setPage(1);
					viewData.jump(1);
				}
				return tmp;
			})
			.then(tmp => {
				setCount(tmp);
				setLoad(false);
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
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
		<div>
			Aucun logs disponibles correspondants aux filtres sélectionnés
		</div>
	);
};

export default AdminLogList;
