import {useState, useEffect, React} from "react";

import EventToken from "./EventToken";

import style from "../style/EventList.module.scss";

import Event from "../pages/body/Event.js";

import usePagination from "./Pagination";
import {Pagination} from "@mui/material";

const EventListPublic = param => {
	const PER_PAGE = 3;
	const [page, setPage] = useState(1);
	const [count, setCount] = useState(0);
	const [data, setData] = useState([]);
	const [telephone, setTelephone] = useState(undefined);
	const [popUpEvent, setPopUpEvent] = useState(-1);
	const viewData = usePagination(data, PER_PAGE);

	useEffect(() => {
		const requestOptions = {
			method: "post",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(param.filter)
		};
		fetch(`${process.env.REACT_APP_API_URL}/event/get`, requestOptions)
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
			.then(newCount => {
				if (newCount < count) {
					setPage(1);
					viewData.jump(1);
				}
				return newCount;
			})
			.then(newCount => {
				setCount(newCount);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [param.filter]);

	useEffect(() => {
		function handleResize() {
			setTelephone(window.innerWidth < window.innerHeight);
		}
		window.addEventListener("resize", handleResize);
		handleResize();
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleChangePage = (e, p) => {
		setPage(p);
		viewData.jump(p);
	};

	return (
		<>
			{param.showCount && (
				<p>
					{data.length}{" "}
					{data.length >= 2 ? <>résultats</> : <>résultat</>}
				</p>
			)}
			<div className={style.eventListContainer}>
				<div className={style.paginationContainer}>
					{data.length > 3 && !telephone && (
						<Pagination
							count={count}
							page={page}
							onChange={handleChangePage}
						/>
					)}
				</div>
				<ul className={style.eventList}>
					{data.length
						? (telephone ? data : viewData.currentData()).map(
								item => (
									<li key={item.id}>
										<EventToken
											setPopUpEvent={setPopUpEvent}
											event={item}
											type="event"
										/>
									</li>
								)
						  )
						: `pouet public`}
				</ul>
				<div className={style.paginationContainer}>
					{data.length > 3 && !telephone && (
						<Pagination
							count={count}
							page={page}
							onChange={handleChangePage}
						/>
					)}
				</div>
			</div>
			{popUpEvent !== -1 && (
				<>
					<div id={style.filter}>
						<div
							id={style.outArea}
							onClick={() => {
								setPopUpEvent(-1);
							}}
						></div>
						<Event
							id={popUpEvent}
							closeEvent={() => {
								setPopUpEvent(-1);
							}}
						/>
					</div>
				</>
			)}
		</>
	);
};

export default EventListPublic;
