import {useState, useEffect, React} from "react";
import usePagination from "./Pagination";
import {Pagination} from "@mui/material";
import {NotificationManager} from "react-notifications";

import style from "../style/AdminLogs.module.scss";

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
		<div className={style.logs}>
			<ul id={style.desc}>
				<li id={style.descType}>Type</li>
				<li id={style.descLogin}>Login</li>
				<li id={style.descMessage}>Message</li>
				<li id={style.descDate}>Date</li>
			</ul>

			<ul>
				{viewData.currentData().map(log => (
					<li id={style.eachLine} key={log.id}>
						<ul className={style.logLine}>
							<li id={style.type} type={log.type}>
								{log.type}
							</li>
							<li id={style.login}>
								{log.login === "Public" ||
								log.login === "42intra-API" ||
								log.login === "INTERNAL" ? (
									log.login
								) : (
									<a href={`/profile/${log.login}`}>
										{log.login}
									</a>
								)}
							</li>
							<li id={style.message}>{log.message}</li>
							<li id={style.date}>
								{new Date(log.date).toLocaleDateString(
									"fr-FR",
									{
										year: "numeric",
										month: "2-digit",
										day: "2-digit",
										hour: "2-digit",
										minute: "2-digit",
										second: "2-digit",
										fractionalSecondDigits: 3
									}
								)}
							</li>
						</ul>
					</li>
				))}
			</ul>
			<div className={style.pagination}>
				<Pagination
					count={count}
					page={page}
					onChange={handleChangePage}
				/>
			</div>
		</div>
	) : (
		<div>
			Aucun logs disponibles correspondants aux filtres sélectionnés
		</div>
	);
};

export default AdminLogList;
