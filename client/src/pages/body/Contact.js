import React from "react";
import {useState, useEffect} from "react";
import {Form, Button} from "react-bootstrap";
import emailjs from "@emailjs/browser";
import {NotificationManager} from "react-notifications";

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

	const sendMail = async () => {
		if (
			formState.mail !== "" &&
			formState.name !== "" &&
			formState.login !== "" &&
			formState.subject !== "" &&
			formState.message !== "" &&
			document.getElementById("emailField").checkValidity()
		) {
			setLock(true);
			//TODO: loading
			await emailjs
				.send(
					global.config.emailjs.service_id,
					global.config.emailjs.template_contact,
					formState,
					global.config.emailjs.public_key
				)
				.then(() => {
					setFormState({
						name: "",
						login: "",
						mail: "",
						subject: "",
						message: ""
					});
				})
				.then(() => {
					NotificationManager.success(
						"Couriel bien envoyé",
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
		} else {
			console.log(formState.subject, formState.subject !== "", formState);
			NotificationManager.error(
				"Please fill up all fields",
				"Erreur",
				3000
			);
		}
	};

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/session`, {
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
				tmp.mail = data.mail;
				tmp.name = data.firstname;
				tmp.login = data.login;
				setFormState(tmp);
				if (data.clearance === 0) setIdForm(false);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, []);

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
					<Form.Group>
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
					<Form.Group>
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
