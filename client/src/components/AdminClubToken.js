import {useEffect, useState, useRef} from "react";
import {Accordion, Form} from "react-bootstrap";
import {Button} from "reactstrap";
import useConfirm from "./useConfirm";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {NotificationManager} from "react-notifications";
import "react-lazy-load-image-component/src/effects/blur.css";

const AdminClubToken = param => {
	const {isConfirmed} = useConfirm();
	const [formState, setFormState] = useState({
		name: "",
		desc: "",
		cost: 0,
		access: "",
		goal: "",
		login: "",
		link: "",
		details: ""
	});
	const [defaultForm, setDefaultForm] = useState({
		name: "",
		desc: "",
		cost: 0,
		access: "",
		goal: "",
		login: "",
		link: "",
		details: ""
	});
	const [bodyState, setBodyState] = useState({
		name: "",
		desc: "",
		cost: 0,
		access: "",
		goal: "",
		login: "",
		link: "",
		details: ""
	});
	const [locked, setLocked] = useState(true);

	const deleteClub = async () => {
		if (
			await isConfirmed(`Désires tu supprimer le club ${param.data.name}`)
		) {
			await fetch(
				`http://${global.config.api.authority}/club/${param.data.id}`,
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
					console.log(
						"Il y a eu un problème avec l'opération fetch: " +
							error.message
					);
				});
		}
	};

	const switchLock = () => {
		setLocked(false);
	};

	const handleFormChange = event => {
		let tmp = {...formState};
		const target = event.target;
		const value =
			target.type === "checkbox" || target.type === "switch"
				? target.checked
				: target.value;
		const name = target.name;
		tmp[name] = value;
		setFormState(tmp);
		setBodyState(tmp);
	};

	const checkStud = async () => {
		await fetch(
			`http://${global.config.api.authority}/stud/${bodyState.login}`,
			{
				credentials: "include"
			}
		)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.text();
			})
			.then(async response => {
				if (!response.length) {
					NotificationManager.error(
						`Le contact ${bodyState.login} n'existe pas`,
						"Erreur",
						5000
					);
					return;
				}
				var myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
				var raw = JSON.stringify({
					name: bodyState.name,
					desc: bodyState.desc,
					cost: bodyState.cost,
					access: bodyState.access,
					goal: bodyState.goal,
					login: bodyState.login,
					link: bodyState.link,
					details: bodyState.details
				});
				var requestOptions = {
					method: "PATCH",
					headers: myHeaders,
					body: raw,
					redirect: "follow",
					credentials: "include"
				};
				await fetch(
					`http://${global.config.api.authority}/club/${param.data.id}`,
					requestOptions
				)
					.then(response => {
						console.log("rep", response);
						if (!response.ok) {
							throw new Error(
								`This is an HTTP error: The status is ${response.status}`
							);
						}
					})
					.then(() => {
						window.location.reload();
						NotificationManager.success(
							`Création du club ${bodyState.name}`,
							"Validation",
							5000
						);
					})
					.catch(function(error) {
						console.log(
							"Il y a eu un problème avec l'opération fetch: " +
								error.message
						);
					});
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	};

	const saveClub = async () => {
		if (
			!document
				.getElementById(`updateClubForm${param.index}`)
				.checkValidity()
		)
			return;

		if (
			await isConfirmed(`Désires tu modifier le club ${param.data.name}`)
		) {
			await checkStud();
		}
	};

	useEffect(() => {
		if (param.data === undefined || param.data === "" || !param.data)
			return;
		let tmp = {...param.data};
		if (tmp.desc === null) tmp.desc = "";
		tmp.name = param.data.name;
		tmp.cost = param.data.cost;
		tmp.desc = param.data.desc;
		tmp.access = param.data.access;
		tmp.goal = param.data.goal;
		tmp.login = param.data.login;
		tmp.link = param.data.link;
		tmp.details = param.data.details;
		setDefaultForm(tmp);
		setFormState(tmp);
		let tmpBody = {...tmp};
		setBodyState(tmpBody);
	}, [param.data]);

	return (
		<>
			<Accordion.Header>{formState.name}</Accordion.Header>
			<Accordion.Body>
				{" "}
				<Form id={`updateClubForm${param.index}`}>
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
					<Form.Label>Description : </Form.Label>
					<Form.Control
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
						step="0.01"
						id="formCost"
						value={formState.cost}
						name="cost"
						onChange={handleFormChange}
						required
					/>
					{"€"}
					<Form.Label>Conditions d'accès : </Form.Label>
					<Form.Control
						disabled={locked}
						name="access"
						type="text"
						id="formAccess"
						value={formState.access}
						onChange={handleFormChange}
						required
					/>
					<Form.Label>Objectif du club : </Form.Label>
					<Form.Control
						disabled={locked}
						name="goal"
						type="text"
						id="formGoal"
						value={formState.goal}
						onChange={handleFormChange}
						required
					/>
					<Form.Label>Liens (optionnel) : </Form.Label>
					<Form.Control
						disabled={locked}
						name="link"
						type="text"
						id="formLink"
						value={formState.link}
						onChange={handleFormChange}
					/>
					<Form.Label>Détails (faq, infos en +, ect) : </Form.Label>
					<Form.Control
						disabled={locked}
						name="details"
						type="text"
						id="formDetails"
						value={formState.details}
						onChange={handleFormChange}
					/>
					<Form.Label>Contact intra 42 : </Form.Label>
					<Form.Control
						disabled={locked}
						name="login"
						type="text"
						id="formLogin"
						value={formState.login}
						onChange={handleFormChange}
					/>
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
							onClick={saveClub}
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
					<Button color="danger" onClick={deleteClub}>
						Supprimer
					</Button>
				</Form>
			</Accordion.Body>
		</>
	);
};

export default AdminClubToken;
