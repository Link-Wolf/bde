import {useState, useEffect, React} from "react";
import usePagination from "../../components/Pagination";
import {Pagination} from "@mui/material";
import AdminNavbar from "../../components/AdminNavbar";
import useConfirm from "../../components/useConfirm";
import {NotificationManager} from "react-notifications";

import style from "../../style/AdminEventsSubscribtions.module.scss";

const AdminStudents = () => {
	const {isConfirmed} = useConfirm();

	const PER_PAGE = 10;
	const [stud, setStud] = useState([]);
	const [page, setPage] = useState(1);
	const [count, setCount] = useState(0);
	const viewData = usePagination(stud, PER_PAGE);
	const [allEvent, setAllEvent] = useState([]);
	const [selectedEvent, setSelectedEvent] = useState("");
	const [update, setUpdate] = useState(false);
	const [subForm, setSubForm] = useState(false);

	const getStud = id => {
		fetch(`${process.env.REACT_APP_API_URL}/inscription/event/${id}`, {
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				if (response) return response.json();
			})
			.then(actualData => {
				setStud(actualData);
				setCount(Math.ceil(actualData.length / PER_PAGE));
			})
			.catch(function(error) {
				setStud([]);
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	};

	const removeStud = (eventId, login) => {
		const requestOptions = {
			method: "DELETE",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			}
		};
		fetch(
			`${process.env.REACT_APP_API_URL}/inscription/${eventId}/${login}`,
			requestOptions
		)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				setUpdate(true);
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	};

	const checkStud = async (eventId, login, eventCost) => {
		const requestOptions = {
			method: "PATCH",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({login: login, cost: eventCost})
		};
		return await fetch(
			`${process.env.REACT_APP_API_URL}/event/admin/${eventId}/inscription`,
			requestOptions
		)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				setUpdate(true);
				return 1;
			})
			.catch(function() {
				setUpdate(true);
			});
	};

	const updateSelectedEvent = event => {
		setSelectedEvent(event.target.value);
	};

	const handleRemoveButton = async login => {
		if (
			await isConfirmed(
				`Tu es certain de vouloir désinscrire ${login} de force ?`
			)
		) {
			removeStud(selectedEvent, login);
			setUpdate(true);
			NotificationManager.success(
				`Désinscription de ${login} à l'évènement`,
				"Validation",
				5000
			);
		}
	};

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/event/all`, {
			credentials: "include"
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
				setAllEvent(actualData);
			})
			.catch(function() {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, []);

	const handleSubButton = async () => {
		let toSub = document.getElementById("studToAdd").value;
		let cost = document.getElementById("cost").value;
		if (
			!document.getElementById("cost").validity.valid ||
			!document.getElementById("studToAdd").validity.valid
		) {
			NotificationManager.error(
				`Les 2 champs doivent être remplis`,
				"Erreur",
				5000
			);
			return;
		}
		if (
			await isConfirmed(
				`Tu es certain de vouloir inscrire ${toSub} de force ?`
			)
		) {
			if (toSub !== "") {
				const check = await checkStud(selectedEvent, toSub, cost);
				if (check == 1) {
					NotificationManager.success(
						`Inscription de ${toSub} à l'évènement`,
						"Validation",
						5000
					);
					document.getElementById("studToAdd").value = "";
					document.getElementById("cost").value = "";
				} else {
					NotificationManager.error(
						`Le student ${toSub} n'existe pas ou est déjà inscrit à l'évènement`,
						"Erreur",
						5000
					);
				}
			}
			setUpdate(true);
		}
	};

	useEffect(() => {
		setUpdate(false);

		if (selectedEvent !== "") {
			getStud(selectedEvent);
			setSubForm(true);
		}
	}, [selectedEvent, update]);

	const handleChangePage = (e, p) => {
		setPage(p);
		viewData.jump(p);
	};

	return (
		<div
			style={{
				display: "flex"
			}}
		>
			<AdminNavbar />
			<div className={style.subscribtionsContainer}>
				<div id={style.tittle}>
					Inscriptions aux <br />
					évènements
				</div>
				<div>
					<form className={style.eventChoice}>
						<label>Evènement :</label>
						<select
							onChange={updateSelectedEvent}
							value={selectedEvent}
						>
							<option value="" disabled hidden>
								Choix de l'évènement
							</option>
							{allEvent.map(event => {
								return (
									<option
										key={event.id}
										value={event.id}
										id={`event_${event.id}`}
										event={event}
									>
										{event.name} (
										{new Date(
											event.begin_date
										).toLocaleDateString("fr-FR", {
											year: "2-digit",
											month: "2-digit",
											day: "2-digit",
											hour: "2-digit",
											minute: "2-digit"
										})}
										)
									</option>
								);
							})}
						</select>
						{subForm ? (
							<label id={style.places}>
								{allEvent.find(event => {
									return event.id == selectedEvent;
								}).nb_places !== -42
									? allEvent.find(event => {
											return event.id == selectedEvent;
									  }).nb_places
									: "∞"}{" "}
								places restantes (dont{" "}
								{
									allEvent.find(event => {
										return event.id == selectedEvent;
									}).nb_premium_places
								}{" "}
								places premiums)
							</label>
						) : (
							<></>
						)}
					</form>

					{subForm &&
					selectedEvent.end_date &&
					selectedEvent.end_date > new Date(Date.now()) ? (
						<form>
							<div className={style.enfantDeSatan}>
								<label>
									Login du student à inscrire et le prix payé
									en cas d'évènement payant
								</label>
								<label id={style.details}>
									{" "}
									(il doit s'être connecté au moins une fois)
								</label>
								<div className={style.addInput}>
									<input
										id="studToAdd"
										type="text"
										placeholder="Login"
										autoFocus={true}
										required
									/>
								</div>
								<div className={style.addInput}>
									<input
										type="number"
										id="cost"
										placeholder="Prix"
										autoFocus={true}
										required
									/>
								</div>
							</div>
							<div className={style.enfantDeSatan}>
								<button
									className={style.subButton}
									type="button"
									onClick={handleSubButton}
								>
									Inscrire
								</button>
							</div>
						</form>
					) : (
						<form>
							<div className={style.enfantDeSatan}></div>
						</form>
					)}

					{selectedEvent ? (
						stud.length > 0 ? (
							<>
								<div id={style.inscrits}>
									Inscrits actuels{" "}
									<label>({stud.length})</label>
								</div>
								<ul>
									{viewData.currentData().map(user => (
										<li
											id={style.eachSub}
											key={user.studLogin}
										>
											<ul className={style.subLine}>
												<li id={style.login}>
													<a
														href={`/profile/${user.studLogin}`}
													>
														{user.studLogin}
													</a>
												</li>
												<li id={style.price}>
													{user.price} €
												</li>
												<li id={style.date}>
													{new Date(
														user.date
													).toLocaleDateString(
														"fr-FR",
														{
															year: "numeric",
															month: "2-digit",
															day: "2-digit",
															hour: "2-digit",
															minute: "2-digit"
														}
													)}
												</li>
												<li id={style.button}>
													{selectedEvent.end_date &&
													selectedEvent.end_date >
														new Date(Date.now()) ? (
														<button
															id={style.unsub}
															onClick={() => {
																handleRemoveButton(
																	user.studLogin
																);
															}}
														>
															❌
														</button>
													) : (
														<button
															id={style.unsub}
														>
															✖️
														</button>
													)}
												</li>
											</ul>
										</li>
									))}
								</ul>
								<div id={style.pagination}>
									<Pagination
										count={count}
										page={page}
										onChange={handleChangePage}
									/>
								</div>
							</>
						) : (
							<div>
								Personne ne s'est encore inscrit à cet évènement
							</div>
						)
					) : (
						<></>
					)}
				</div>
			</div>
		</div>
	);
};

export default AdminStudents;
