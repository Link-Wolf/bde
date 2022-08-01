import React from "react";
import {useState, useEffect} from "react";
import {Form, Button} from "react-bootstrap";

const Contact = () => {
	const [idForm, setIdForm] = useState(<></>);
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const sendMail = () => {};

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
				setEmail(data.email);
				setName(data.firstname);
				if (data.clearance === 0)
					setIdForm(
						<Form.Group>
							<Form.Group>
								<Form.Label>Nom</Form.Label>
								<Form.Control placeholder="Veuillez entrer votre nom" />
							</Form.Group>
							<Form.Group>
								<Form.Label>Email</Form.Label>
								<Form.Control
									type="email"
									placeholder="Veuillez entrer votre mail afin de vous recontacter"
								/>
								<Form.Text className="text-muted">
									Nous ne partagerons jamais votre mail
								</Form.Text>
							</Form.Group>
						</Form.Group>
					);
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
			<Form.Group className="mb-3">
				<Form.Label>Sujet</Form.Label>
				<Form.Select aria-label="Sélectionnez le sujet">
					<option value="" selected disabled hidden>
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
				<Form.Control as="textarea" />
			</Form.Group>
			{idForm}
			<Button variant="outline-primary" onClick={sendMail}>
				Envoyer
			</Button>
		</Form>
	);
};
export default Contact;
