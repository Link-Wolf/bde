import React from "react";
import {useState, useEffect} from "react";
import {Form, Button} from "react-bootstrap";
import emailjs from "@emailjs/browser";
import {NotificationManager} from "react-notifications";
import Loading from "../../components/Loading";

const Contact = () => {
	const [idForm, setIdForm] = useState(true);
	const [formState, setFormState] = useState({
		name: "",
		login: "",
		mail: "",
		subject: "",
		message: ""
	});
	const [lock, setLock] = useState(false);
	const [sent, setSent] = useState(false);
	const [loading, setLoading] = useState(false);
	const [needMail, setNeedMail] = useState(false);

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
	};

	const videMoiLChampLô = async () => {
		if (formState.login)
			setFormState({
				name: formState.name,
				login: formState.login,
				mail: formState.mail,
				subject: "",
				message: ""
			});
		else
			setFormState({
				name: "",
				login: "",
				mail: "",
				subject: "",
				message: ""
			});
	};

	const sendMail = async () => {
		console.log(formState);
		if (
			formState.mail === "" ||
			formState.name === "" ||
			formState.subject === "" ||
			formState.message === "" ||
			!document.getElementById("emailField").checkValidity()
		) {
			NotificationManager.error(
				"Veuillez remplir tous les champs",
				"Erreur",
				5000
			);
			return;
		}
		setLock(true);
		setLoading(true);
		await emailjs
			.send(
				process.env.REACT_APP_EMAILJS_SERVICE,
				process.env.REACT_APP_EMAILJS_TEMPLATE_CONTACT,
				formState,
				process.env.REACT_APP_EMAILJS_PUBLICKEY
			)
			.then(async () => {
				if (formState.login !== -42 && needMail)
					await fetch(
						`${process.env.REACT_APP_API_URL}/stud/${formState.login}`,
						{
							credentials: "include",
							method: "PATCH",
							body: JSON.stringify({
								true_email: formState.mail
							}),
							headers: {
								"Content-Type": "application/json"
							}
						}
					)
						.then(response => {
							if (!response.ok) {
								throw new Error(
									`This is an HTTP error: The status is ${response.status}`
								);
							}
							setNeedMail(false);
						})
						.catch(function(error) {
							console.log(
								"Il y a eu un problème avec l'opération fetch: " +
									error.message
							);
						});
			})
			.then(async () => {
				await videMoiLChampLô();
			})
			.then(() => {
				NotificationManager.success(
					"Votre message a bien été envoyé",
					"Success",
					5000
				);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération mail: " +
						error.message
				);
			});
		setLock(false);
		setSent(true);
		setLoading(false);
	};

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
				let tmp = formState;
				tmp.name = data.firstname;
				tmp.login = data.login;
				setFormState(tmp);
				if (data.clearance === 0) setIdForm(false);
				else checkTrueMail(tmp.login);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, []);

	useEffect(() => {
		if (
			!formState.login ||
			formState.login == undefined ||
			formState.login == ""
		)
			return;
		fetch(`${process.env.REACT_APP_API_URL}/stud/${formState.login}/mail`, {
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.text();
			})
			.then(data => {
				let tmp = formState;
				tmp.mail = data;
				setFormState(tmp);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [formState.login]);

	const checkTrueMail = async login => {
		fetch(`${process.env.REACT_APP_API_URL}/stud/${login}`, {
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
				let tmp = formState;
				if (!data.true_email) {
					setNeedMail(true);
					tmp.mail = "";
				} else {
					tmp.mail = data.true_email;
				}
				setFormState(tmp);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	};

	if (sent)
		return (
			<>
				<p>Merci pour votre retour !</p>
				<button
					onClick={() => {
						setSent(false);
					}}
				>
					Envoyer un nouveau message
				</button>
			</>
		);
	if (loading) return <Loading />;
	return (
		<div>
			<Form>
				<Form.Group>
					<Form.Label>Sujet</Form.Label>
					<Form.Select
						aria-label="Sélectionnez le sujet"
						value={formState.subject}
						onChange={handleFormChange}
						name="subject"
						required
						disabled={lock}
					>
						<option value="" disabled hidden>
							Sélectionnez le sujet ici..
						</option>
						<option value="Idées et suggestions">
							Suggestion / Idées
						</option>
						<option value="Partenariat">Partenariat</option>
						<option value="Réclamation">Réclamation</option>
						<option value="Club">Club</option>
						<option value="Boutique">Boutique</option>
						<option value="Feedback">Feedback d'un event</option>
						<option value="Autre">Autre</option>
					</Form.Select>
				</Form.Group>
				<Form.Group>
					<Form.Label>Message</Form.Label>
					<Form.Control
						as="textarea"
						placeholder="Votre messsage"
						value={formState.message}
						onChange={handleFormChange}
						name="message"
						required
						disabled={lock}
						minLength={10}
					/>
				</Form.Group>
				<Form.Group hidden={idForm}>
					<Form.Label>Nom</Form.Label>
					<Form.Control
						placeholder="Veuillez entrer votre nom"
						value={formState.name}
						onChange={handleFormChange}
						name="name"
						required
						disabled={lock}
					/>
				</Form.Group>
				<Form.Group hidden={!needMail && idForm}>
					<Form.Label>Email</Form.Label>
					<Form.Control
						disabled={lock}
						type="email"
						placeholder="Veuillez entrer votre mail afin de vous recontacter"
						value={formState.mail}
						onChange={handleFormChange}
						name="mail"
						id="emailField"
						required
					/>
					<Form.Text className="text-muted">
						Nous ne partagerons jamais votre mail
					</Form.Text>
				</Form.Group>
				<Button
					variant="outline-primary"
					disabled={lock}
					onClick={sendMail}
				>
					Envoyer
				</Button>
			</Form>
		</div>
	);
};
export default Contact;
