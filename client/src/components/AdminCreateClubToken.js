import {useState, useRef} from "react";
import {Button, Form} from "react-bootstrap";
import useConfirm from "./useConfirm";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {NotificationManager} from "react-notifications";
import "react-lazy-load-image-component/src/effects/blur.css";

const AdminCreateClubToken = param => {
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

	const handleFormChange = event => {
		let tmp = {...formState};
		const target = event.target;
		const value =
			target.type === "checkbox" || target.type === "switch"
				? target.checked
				: target.value;
		const name = target.name;

		tmp[name] = value;
		setBodyState(tmp);
		setFormState(tmp);
	};

	const checkStud = async () => {
		await fetch(
			`${process.env.REACT_APP_API_URL}/stud/${bodyState.login}`,
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
					method: "POST",
					headers: myHeaders,
					body: raw,
					redirect: "follow",
					credentials: "include"
				};
				await fetch(
					`${process.env.REACT_APP_API_URL}/club`,
					requestOptions
				)
					.then(response => {
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
						NotificationManager.error(
							"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
							"Erreur",
							5000
						);
					});
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	};

	const saveClub = async () => {
		if (!document.getElementById("createClubForm").checkValidity()) return;
		const confirm = await isConfirmed(`Désires tu créer ce club ?`);
		if (confirm) {
			await checkStud();
		}
	};

	return (
		<>
			<Form id="createClubForm">
				<Form.Label>Nom : </Form.Label>
				<Form.Control
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
					as="textarea"
					rows={3}
					name="desc"
					value={formState.desc}
					onChange={handleFormChange}
					id="formDesc"
				/>
				<Form.Label>Prix : </Form.Label>
				<Form.Control
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
					name="access"
					type="text"
					id="formAccess"
					value={formState.access}
					onChange={handleFormChange}
					required
				/>
				<Form.Label>Objectif du club : </Form.Label>
				<Form.Control
					name="goal"
					type="text"
					id="formGoal"
					value={formState.goal}
					onChange={handleFormChange}
					required
				/>
				<Form.Label>Liens (optionnel) : </Form.Label>
				<Form.Control
					name="link"
					type="text"
					id="formLink"
					value={formState.link}
					onChange={handleFormChange}
				/>
				<Form.Label>Détails (faq, infos en +, ect) : </Form.Label>
				<Form.Control
					name="details"
					type="text"
					id="formDetails"
					value={formState.details}
					onChange={handleFormChange}
				/>
				<Form.Label>Contact intra 42 : </Form.Label>
				<Form.Control
					name="login"
					type="text"
					id="formLogin"
					value={formState.login}
					onChange={handleFormChange}
				/>
				<Button type="button" defaultValue={-1} onClick={saveClub}>
					Enregistrer
				</Button>
				<Button type="button" defaultValue={-1} onClick={param.cancel}>
					Annuler
				</Button>
			</Form>
		</>
	);
};

export default AdminCreateClubToken;
