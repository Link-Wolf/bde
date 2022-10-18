import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import Placeholder from "react-bootstrap/Placeholder";
import useConfirm from "./useConfirm";

const AdminContribToken = param => {
	const {isConfirmed} = useConfirm();
	const [formState, setFormState] = useState({
		studLogin: "",
		cost: "",
		begin_date: "",
		end_date: ""
	});
	const [bodyState, setBodyState] = useState({
		studLogin: "",
		cost: "",
		begin_date: "",
		end_date: ""
	});
	const [locked, setLocked] = useState(true);
	const [button, setButton] = useState(
		<Placeholder.Button variant="primary" />
	);

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
		let begin_date = new Date(Date.parse(tmp.begin_date));
		let end_date = new Date(Date.parse(tmp.end_date));
		let tmpBody = {...tmp};
		tmpBody.end_date =
			two_digiter(end_date.getFullYear()) +
			"-" +
			two_digiter(end_date.getMonth() + 1) +
			"-" +
			two_digiter(end_date.getDate());
		tmpBody.begin_date =
			two_digiter(begin_date.getFullYear()) +
			"-" +
			two_digiter(begin_date.getMonth() + 1) +
			"-" +
			two_digiter(begin_date.getDate());
		setBodyState(tmpBody);
		setFormState(tmp);
	};

	const two_digiter = nb => {
		if (nb < 10) return "0" + nb;
		return nb;
	};

	useEffect(() => {
		if (param === undefined || param === "" || !param) return;
		let tmp = {...param.data};
		tmp.hasEndDate = param.data.end_date !== null;
		tmp.end_date = tmp.end_date ? tmp.end_date : tmp.begin_date;
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
		setFormState(tmp);
	}, [param]);

	const saveContrib = async () => {
		if (
			await isConfirmed(
				`Désires tu modifier la cotisation de ${param.data.studLogin} ?`
			)
		) {
			if (
				new Date(bodyState.end_date) <= new Date(bodyState.begin_date)
			) {
				NotificationManager.error(
					"La date de début doit précéder la date de fin",
					"Erreur",
					5000
				);
			} else {
				var myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");

				var raw = JSON.stringify({
					stud: param.data.studLogin,
					cost: param.data.cost,
					begin_date: bodyState.begin_date,
					end_date: bodyState.end_date
				});

				var requestOptions = {
					method: "PATCH",
					headers: myHeaders,
					body: raw,
					redirect: "follow",
					credentials: "include"
				};

				fetch(
					`http://${global.config.api.authority}/contribution/admin/${param.data.studLogin}`,
					requestOptions
				)
					.then(response => {
						if (!response.ok) {
							throw new Error(
								`This is an HTTP error: The status is ${response.status}`
							);
						}
					})
					.catch(function(error) {
						console.log(
							"Il y a eu un problème avec l'opération fetch: " +
								error.message
						);
					});
				NotificationManager.success(
					"Cotisation mise à jour",
					"Validation",
					5000
				);
				setLocked(true);
			}
		}
	};

	return (
		<>
			{formState.studLogin}{" "}
			{new Date(formState.begin_date).toLocaleDateString()}
			<form>
				<label>Stud : </label>
				<input
					disabled={true}
					name="studLogin"
					type="text"
					id="formStud"
					autoFocus="autofocus"
					value={formState.studLogin}
					required
				/>
				<label>Prix : </label>
				<input
					disabled={true}
					type="text"
					min="0"
					step="0.01"
					id="formCost"
					value={formState.cost}
					name="cost"
					required
				/>{" "}
				€<label> Dates : </label>
				<input
					id="formBeginDate"
					disabled={locked}
					type="datetime-local"
					name="begin_date"
					value={formState.begin_date}
					onChange={handleFormChange}
					required
					max={formState.end_date}
				/>
				{" - "}
				<input
					id="formEndDate"
					disabled={locked}
					name="end_date"
					value={formState.end_date}
					onChange={handleFormChange}
					type="datetime-local"
					required
					min={formState.begin_date}
				/>
				{locked ? (
					<Button
						type="button"
						defaultValue={param.index}
						onClick={switchLock}
					>
						Modifier
					</Button>
				) : (
					<Button
						type="button"
						defaultValue={param.index}
						onClick={saveContrib}
					>
						Enregistrer
					</Button>
				)}
			</form>
		</>
	);
};

export default AdminContribToken;
