import React from "react";
import {useState, useEffect} from "react";
import {Form, Button} from "react-bootstrap";
import emailjs from "@emailjs/browser";
import {NotificationManager} from "react-notifications";
import LoadingMedium from "../../components/Loading";
import style from "../../style/Contact.module.scss";

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
							NotificationManager.error(
								"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
								"Erreur",
								5000
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
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
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
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, []);

	useEffect(() => {
		if (
			!formState.login ||
			formState.login === undefined ||
			formState.login === "" ||
			formState.login === -42
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
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
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
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	};

	if (sent)
		return (
			<div className={style.contactContainer}>
				<form>
					<p id={style.pouet}>Merci pour votre retour !</p>
					<button
						id={style.resend}
						onClick={() => {
							setSent(false);
						}}
					>
						Envoyer un nouveau message
					</button>
				</form>
			</div>
		);
	if (loading)
		return (
			<div className={style.contactContainer}>
				<div id={style.loading}>
					<LoadingMedium />
				</div>
			</div>
		);
	return (
		<div className={style.contactContainer}>
			<form>
				<div className={style.section}>
					<label>Sujet</label>
					<select
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
					</select>
				</div>
				<div className={style.section}>
					<label>Message</label>
					<textarea
						placeholder="Votre messsage"
						value={formState.message}
						onChange={handleFormChange}
						name="message"
						required
						disabled={lock}
						minLength={10}
					/>
				</div>
				<div className={style.section} hidden={idForm}>
					<label>Nom</label>
					<input
						placeholder="Jean-Billy"
						value={formState.name}
						onChange={handleFormChange}
						name="name"
						required
						disabled={lock}
					/>
				</div>
				<div className={style.section} hidden={!needMail && idForm}>
					<label>Email</label>
					<input
						disabled={lock}
						type="email"
						placeholder="me@exemple.net"
						value={formState.mail}
						onChange={handleFormChange}
						name="mail"
						id="emailField"
						required
					/>
					<p>Nous ne partagerons jamais votre mail.</p>
				</div>
				<button
					variant="outline-primary"
					disabled={lock}
					onClick={sendMail}
				>
					Envoyer
				</button>
			</form>
		</div>
	);
};
export default Contact;
