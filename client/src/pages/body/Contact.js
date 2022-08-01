import React from "react";
import {useState, useEffect} from "react";
import {Form, Button} from "react-bootstrap";
import emailjs from "@emailjs/browser";

const Contact = () => {
	const [idForm, setIdForm] = useState(true);
	const [formState, setFormState] = useState({
		name: "",
		mail: "",
		subject: "",
		message: ""
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
		setFormState(tmp);
	};

	const sendMail = () => {
		window.confirm();
		emailjs
			.send(
				global.config.emailjs.service_id,
				global.config.emailjs.template_id,
				formState,
				global.config.emailjs.public_key
			)
			.then(
				result => {
					console.log(result.text);
				},
				error => {
					console.log(error.text);
				}
			)
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération mail: " +
						error.message
				);
			});
	};

	useEffect(() => {
		fetch(`http://localhost:4242/session`, {
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
				setFormState({
					mail: data.mail,
					name: data.firstname
				});
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
		<Form>
			<Form.Group>
				<Form.Label>Sujet</Form.Label>
				<Form.Select
					aria-label="Sélectionnez le sujet"
					value={formState.subject}
					onChange={handleFormChange}
					name="subject"
				>
					<option value="" disabled hidden>
						Sélectionnez le sujet ici..
					</option>
					<option value="idea">Suggestion / Idées</option>
					<option value="sponso">Partenariat</option>
					<option value="karen">Réclamation</option>
					<option value="shop">Boutique</option>
					<option value="feedback">Feedback d'un event</option>
					<option value="other">Autre</option>
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
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>Email</Form.Label>
					<Form.Control
						type="email"
						placeholder="Veuillez entrer votre mail afin de vous recontacter"
						value={formState.mail}
						onChange={handleFormChange}
						name="mail"
					/>
					<Form.Text className="text-muted">
						Nous ne partagerons jamais votre mail
					</Form.Text>
				</Form.Group>
			</Form.Group>
			<Button variant="outline-primary" onClick={sendMail}>
				Envoyer
			</Button>
		</Form>
	);
};
export default Contact;
