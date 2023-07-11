import {useEffect, useState} from "react";
import {Accordion, Form} from "react-bootstrap";
import {Button} from "reactstrap";
import useConfirm from "./useConfirm";
import {NotificationManager} from "react-notifications";
import "react-lazy-load-image-component/src/effects/blur.css";

/**
 * @brief Parse the date the to the format used by the API
 */
const parseDate = date => {
	return (
		two_digiter(date.getFullYear()) +
		"-" +
		two_digiter(date.getMonth() + 1) +
		"-" +
		two_digiter(date.getDate()) +
		"T" +
		two_digiter(date.getHours()) +
		":" +
		two_digiter(date.getMinutes())
	);
};

/**
 * @brief Add a 0 before the number if it's under 10
 */
const two_digiter = nb => {
	if (nb < 10) return "0" + nb;
	return nb;
};

/**
 * @brief Component to manage the event
 * @param param data: the event data
 * @returns {JSX.Element} the component to manage the event
 */
const AdminEventToken = param => {
	const {isConfirmed} = useConfirm();
	const [formState, setFormState] = useState({
		name: "",
		desc: "",
		begin_date: parseDate(new Date(Date.now())),
		end_date: parseDate(new Date(Date.now())),
		available_date: parseDate(new Date(Date.now())),
		sub_date: parseDate(new Date(Date.now())),
		place: "",
		nb_places: 0,
		nb_premium_places: 0,
		cost: 0,
		premium_cost: 0,
		hasEndDate: true,
		hasSubDate: true,
		sponso: true,
		consos: true,
		isOutside: true,
		for_pool: true
	});
	const [defaultForm, setDefaultForm] = useState({
		name: "",
		desc: "",
		begin_date: "",
		end_date: "",
		available_date: "",
		sub_date: "",
		place: "",
		nb_places: 0,
		nb_premium_places: 0,
		cost: 0,
		premium_cost: 0,
		hasEndDate: true,
		hasSubDate: true,
		sponso: true,
		consos: true,
		isOutside: true,
		for_pool: true
	});
	const [bodyState, setBodyState] = useState({
		name: "",
		desc: "",
		begin_date: parseDate(new Date(Date.now())),
		end_date: parseDate(new Date(Date.now())),
		available_date: parseDate(new Date(Date.now())),
		sub_date: parseDate(new Date(Date.now())),
		place: "",
		nb_places: 0,
		nb_premium_places: 0,
		cost: 0,
		premium_cost: 0,
		hasEndDate: true,
		hasSubDate: true,
		sponso: true,
		consos: true,
		isOutside: true,
		for_pool: true
	});
	const [locked, setLocked] = useState(true);
	const [session, setSession] = useState({clearance: 0});
	const [thumbnail, setThumbnail] = useState([]);

	/**
	 * Check the session to verify who is logged
	 */
	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/session`, {
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
			.then(data => {
				setSession(data);
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, []);

	/**
	 * Tell the API to delete the event
	 */
	const deleteEvent = async () => {
		if (session.clearance < 42) {
			await isConfirmed(
				`C'est compliqué y a des trucs à gérer qu'on fix bientôt, contacte ### ou Xxxxx si tu veux faire ça stp`
			);
			return;
		}

		if (
			await isConfirmed(
				`Désires tu supprimer l'évènement ${param.data.name} ?`
			)
		) {
			await fetch(
				`${process.env.REACT_APP_API_URL}/event/${param.data.id}`,
				{
					method: "DELETE",
					credentials: "include"
				}
			)
				.then(response => {
					if (!response.ok) {
						throw new Error(
							`This is an HTTP error:
					 The status is ${response.status}`
						);
					}
					window.location.reload();
				})
				.catch(function(error) {
					NotificationManager.error(
						"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
						"Erreur",
						5000
					);
				});
		}
	};

	const switchLock = () => {
		setLocked(false);
	};

	/**
	 * @brief Handle form changes and update the state
	 */
	const handleFormChange = event => {
		let tmp = {...formState};
		const target = event.target;
		const value =
			target.type === "checkbox" || target.type === "switch"
				? target.checked
				: target.value;
		const name = target.name;
		tmp[name] = value;
		let begin_date = new Date(Date.parse(tmp.begin_date));
		let end_date = new Date(Date.parse(tmp.end_date));
		let available_date = new Date(Date.parse(tmp.available_date));
		let tmpBody = {...tmp};
		tmpBody.end_date =
			two_digiter(end_date.getFullYear()) +
			"-" +
			two_digiter(end_date.getMonth() + 1) +
			"-" +
			two_digiter(end_date.getDate()) +
			"T" +
			two_digiter(end_date.getHours()) +
			":" +
			two_digiter(end_date.getMinutes());
		tmpBody.begin_date =
			two_digiter(begin_date.getFullYear()) +
			"-" +
			two_digiter(begin_date.getMonth() + 1) +
			"-" +
			two_digiter(begin_date.getDate()) +
			"T" +
			two_digiter(begin_date.getHours()) +
			":" +
			two_digiter(begin_date.getMinutes());
		tmpBody.available_date =
			two_digiter(available_date.getFullYear()) +
			"-" +
			two_digiter(available_date.getMonth() + 1) +
			"-" +
			two_digiter(available_date.getDate()) +
			"T" +
			two_digiter(available_date.getHours()) +
			":" +
			two_digiter(available_date.getMinutes());
		setFormState(tmp);
		setBodyState(tmpBody);
	};

	/**
	 * @brief Tell the API to update the thumbnail
	 */
	const changeThumbnail = async () => {
		const data = new FormData();
		data.append("thumbnail", thumbnail[0]);
		await fetch(
			`${process.env.REACT_APP_API_URL}/event/upload_image
			/${param.data.id}`,
			{
				method: "POST",
				credentials: "include",
				body: data
			}
		)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error:
					 The status is ${response.status}`
					);
				}
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	};

	/**
	 * @brief Tell the API to update the event
	 */
	const saveEvent = async () => {
		if (
			!document
				.getElementById(`updateEventForm${param.index}`)
				.checkValidity()
		)
		{
			NotificationManager.warning(
				"Renseignes tous les champs obligatoires",
				"Attention",
				5000
			);
			return;
		}
		if (
			await isConfirmed(
				`Désires tu modifier l'évènement ${param.data.name}`
			)
		) {
			var myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");

			var raw = JSON.stringify({
				name: bodyState.name,
				cost: bodyState.cost,
				place: bodyState.place,
				premium_cost: bodyState.premium_cost,
				nb_places: bodyState.nb_places,
				desc: bodyState.desc,
				isOutside: bodyState.isOutside,
				consos: bodyState.consos,
				sponso: bodyState.sponso,
				begin_date: new Date(bodyState.begin_date).setHours(
					new Date(bodyState.begin_date).getHours()
				),
				available_date: new Date(bodyState.available_date).setHours(
					new Date(bodyState.available_date).getHours()
				),
				end_date: bodyState.hasEndDate
					? new Date(bodyState.end_date).setHours(
							new Date(bodyState.end_date).getHours()
					  )
					: null,
				sub_date: bodyState.hasSubDate
				? new Date(bodyState.sub_date).setHours(
						new Date(bodyState.sub_date).getHours()
					)
				: null,
				for_pool: bodyState.for_pool
			});
			var requestOptions = {
				method: "PATCH",
				headers: myHeaders,
				body: raw,
				redirect: "follow",
				credentials: "include"
			};

			await fetch(
				`${process.env.REACT_APP_API_URL}/event/${param.data.id}`,
				requestOptions
			)
				.then(response => {
					if (!response.ok) {
						throw new Error(
							`This is an HTTP error:
							 The status is ${response.status}`
						);
					}
				})
				.catch(function(error) {
					NotificationManager.error(
						"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
						"Erreur",
						5000
					);
				});
			await changeThumbnail();
			window.location.reload();
		}
	};

	/**
	 * @brief code from the bottom pit of hell that parses the date to the format the form wants
	 */
	useEffect(() => {
		if (param.data === undefined || param.data === "" || !param.data)
			return;
		let tmp = {...param.data};
		if (tmp.desc === null) tmp.desc = "";
		tmp.hasEndDate = param.data.end_date !== null;
		tmp.end_date = tmp.end_date ? tmp.end_date : null;
		let end_date = new Date(Date.parse(tmp.end_date));
		tmp.end_date =
			two_digiter(end_date.getFullYear()) +
			"-" +
			two_digiter(end_date.getMonth() + 1) +
			"-" +
			two_digiter(end_date.getDate()) +
			"T" +
			two_digiter(end_date.getHours()) +
			":" +
			two_digiter(end_date.getMinutes());
		let begin_date = new Date(Date.parse(tmp.begin_date));
		tmp.begin_date =
			two_digiter(begin_date.getFullYear()) +
			"-" +
			two_digiter(begin_date.getMonth() + 1) +
			"-" +
			two_digiter(begin_date.getDate()) +
			"T" +
			two_digiter(begin_date.getHours()) +
			":" +
			two_digiter(begin_date.getMinutes());
		let available_date = new Date(Date.parse(tmp.available_date));
		tmp.available_date =
			two_digiter(available_date.getFullYear()) +
			"-" +
			two_digiter(available_date.getMonth() + 1) +
			"-" +
			two_digiter(available_date.getDate()) +
			"T" +
			two_digiter(available_date.getHours()) +
			":" +
			two_digiter(available_date.getMinutes());
		tmp.hasSubDate = param.data.sub_date !== null;
		tmp.sub_date = tmp.sub_date ? tmp.sub_date : null;
		let sub_date = new Date(Date.parse(tmp.sub_date));
		tmp.sub_date =
			two_digiter(sub_date.getFullYear()) +
			"-" +
			two_digiter(sub_date.getMonth() + 1) +
			"-" +
			two_digiter(sub_date.getDate()) +
			"T" +
			two_digiter(sub_date.getHours()) +
			":" +
			two_digiter(sub_date.getMinutes());
		tmp.isOutside = param.data.isOutside;
		tmp.sponso = param.data.sponso;
		tmp.consos = param.data.consos;
		tmp.for_pool = param.data.for_pool;
		setDefaultForm(tmp);
		setFormState(tmp);
		let tmpBody = {...tmp};
		tmpBody.end_date =
			two_digiter(end_date.getFullYear()) +
			"-" +
			two_digiter(end_date.getMonth() + 1) +
			"-" +
			two_digiter(end_date.getDate()) +
			"T" +
			two_digiter(end_date.getHours()) +
			":" +
			two_digiter(end_date.getMinutes());
		tmpBody.begin_date =
			two_digiter(begin_date.getFullYear()) +
			"-" +
			two_digiter(begin_date.getMonth() + 1) +
			"-" +
			two_digiter(begin_date.getDate()) +
			"T" +
			two_digiter(begin_date.getHours()) +
			":" +
			two_digiter(begin_date.getMinutes());
		tmpBody.available_date =
			two_digiter(available_date.getFullYear()) +
			"-" +
			two_digiter(available_date.getMonth() + 1) +
			"-" +
			two_digiter(available_date.getDate()) +
			"T" +
			two_digiter(available_date.getHours()) +
			":" +
			two_digiter(available_date.getMinutes());
		tmpBody.sub_date =
			two_digiter(sub_date.getFullYear()) +
			"-" +
			two_digiter(sub_date.getMonth() + 1) +
			"-" +
			two_digiter(sub_date.getDate()) +
			"T" +
			two_digiter(sub_date.getHours()) +
			":" +
			two_digiter(sub_date.getMinutes());
		setBodyState(tmpBody);
	}, [param.data]);

	/**
	 * @brief get the thumbnail of the event
	 */
	useEffect(() => {
		if (param === undefined || param === "" || !param) return;
		fetch(
			`${process.env.REACT_APP_API_URL}/event/${param.data.id}/thumbnail`,
			{
				credentials: "include"
			}
		)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is` +
							` ${response.status}`
					);
				}
				return response.blob();
			})
			.then(blob => {
				setThumbnail([blob]);
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, [param]);

	return (
		<>
			<Accordion.Header>
				{formState.name} -{" "}
				{new Intl.DateTimeFormat("fr-FR", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
					hour: "2-digit",
					minute: "2-digit"
				}).format(new Date(formState.begin_date))}
			</Accordion.Header>
			<Accordion.Body>
				{" "}
				<Form id={`updateEventForm${param.index}`}>
					<Form.Label>Nom : </Form.Label>
					<Form.Control
						disabled={locked}
						name="name"
						type="text"
						id="formName"
						autoFocus="autofocus"
						value={formState.name}
						onChange={handleFormChange}
						required
					/>
					<Form.Label> Dates : </Form.Label>
					<Form.Control
						id="formBeginDate"
						disabled={locked}
						max={
							formState.hasEndDate ? formState.end_date : Infinity
						}
						type="datetime-local"
						name="begin_date"
						value={formState.begin_date}
						onChange={handleFormChange}
						required
					/>
					<Form.Switch
						disabled={locked}
						name="hasEndDate"
						id="hasEndDate"
						checked={formState.hasEndDate}
						onChange={handleFormChange}
					/>
					<Form.Control
						id="formEndDate"
						min={formState.begin_date}
						disabled={locked || !formState.hasEndDate}
						name="end_date"
						value={formState.end_date}
						onChange={handleFormChange}
						type="datetime-local"
					/>
					<Form.Switch
						disabled={locked}
						name="hasSubDate"
						id="hasSubDate"
						checked={formState.hasSubDate}
						onChange={handleFormChange}
					/>
					<Form.Label hidden={locked || !formState.hasSubDate}>Date de fin d'inscription : </Form.Label>
					<Form.Control
						id="formSubDate"
						name="sub_date"
						min={formState.begin_date}
						hidden={locked || !formState.hasSubDate}
						value={formState.sub_date}
						onChange={handleFormChange}
						type="datetime-local"
					/>
					<Form.Label>Date de disponibilité : </Form.Label>
					<Form.Control
						id="formEndDate"
						disabled={locked}
						name="available_date"
						value={formState.available_date}
						onChange={handleFormChange}
						type="datetime-local"
					/>
					<Form.Label>Description : </Form.Label>
					<Form.Control
						as="textarea"
						rows={3}
						name="desc"
						value={formState.desc}
						disabled={locked}
						onChange={handleFormChange}
						id="formDesc"
					/>
					<Form.Label>Prix : </Form.Label>
					<Form.Control
						disabled={locked}
						type="number"
						min="0"
						step="1"
						id="formCost"
						value={formState.cost}
						name="cost"
						onChange={handleFormChange}
						required
					/>{" "}
					€ (
					<Form.Control
						disabled={locked}
						type="number"
						min="0"
						id="formPremiumCost"
						step="1"
						name="premium_cost"
						onChange={handleFormChange}
						value={formState.premium_cost}
					/>
					€ )<Form.Label>Nombre de places : </Form.Label>
					{" ? / "}
					<Form.Control
						disabled={locked}
						type="number"
						id="formNbPlaces"
						min="-42"
						name="nb_places"
						onChange={handleFormChange}
						value={formState.nb_places}
					/>
					<Form.Label>
						Nombre de places réservées aux cotisés :{" "}
					</Form.Label>
					{" ? / "}
					<Form.Control
						disabled={locked}
						type="number"
						id="formNbPremiumPlaces"
						min="0"
						name="nb_premium_places"
						onChange={handleFormChange}
						value={formState.nb_premium_places}
					/>
					<Form.Label>Lieu : </Form.Label>
					<Form.Control
						disabled={locked}
						type="text"
						id="formPlace"
						name="place"
						onChange={handleFormChange}
						value={formState.place}
						required
					/>
					<Form.Switch
						disabled={locked}
						id="formIsOutside"
						label="À l'extérieur de 42"
						name="isOutside"
						onChange={handleFormChange}
						checked={formState.isOutside}
					/>
					<Form.Switch
						disabled={locked}
						id="formSponso"
						label="Sponsorisé"
						name="sponso"
						onChange={handleFormChange}
						checked={formState.sponso}
					/>
					<Form.Switch
						disabled={locked}
						id="formConsos"
						label="Consommations"
						name="consos"
						onChange={handleFormChange}
						checked={formState.consos}
					/>
					<Form.Switch
						disabled={locked}
						id="formForPool"
						label="Ouvert aux piscineux"
						name="for_pool"
						onChange={handleFormChange}
						checked={formState.for_pool}
					/>
					<input
						type="file"
						id="thumbnail"
						accept="img/png, img/jpeg"
						files={thumbnail}
						onChange={event => {
							setThumbnail(event.target.files);
						}}
						disabled={locked}
					/>
					{thumbnail.length && (
						<img alt=""
							height="150px"
							src={URL.createObjectURL(thumbnail[0])}
							width="auto"
							effect="blur"
						/>
					)}
					{locked ? (
						<Button
							type="button"
							color="primary"
							defaultValue={param.index}
							onClick={switchLock}
						>
							Modifier
						</Button>
					) : (
						<Button
							type="button"
							color="primary"
							defaultValue={param.index}
							onClick={saveEvent}
						>
							Enregistrer
						</Button>
					)}
					<Button
						color="secondary"
						onClick={() => {
							setFormState(defaultForm);
							setLocked(true);
						}}
						disabled={locked}
					>
						Annuler
					</Button>
					<Button color="danger" onClick={deleteEvent}>
						Supprimer
					</Button>
				</Form>
			</Accordion.Body>
		</>
	);
};

export default AdminEventToken;
