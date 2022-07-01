import {useEffect, useState} from "react";

import {Accordion, Button, Form} from "react-bootstrap";

const AdminEventToken = param => {
	const [formState, setFormState] = useState({});
	const [locked, setLocked] = useState(false);
	const [button, setButton] = useState(<></>);
	const [update, setUpdate] = useState(false);
	const [isCheckedDate, setIsCheckedDate] = useState(true); //FIX

	const switchLock = () => {
		setLocked(false);
		setUpdate(true);
	};

	const handleCheckDate = () => {
		const invertedCheck = !isCheckedDate;
		setIsCheckedDate(invertedCheck);
	};

	const saveEvent = () => {
		if (window.confirm(`Desire tu modifier l'event ${param.data.name}`));
		{
			console.log(document.getElementById("formBeginDate").value);
			let body = JSON.stringify({
				name: document.getElementById("formName").value,
				cost: document.getElementById("formCost").value,
				place: document.getElementById("formPlace").value,
				premium_cost: document.getElementById("formPremiumCost").value,
				nb_places: document.getElementById("formNbPlaces").value,
				desc: document.getElementById("formDesc").value,
				isOutside: document.getElementById("formIsOutside").value,
				consos:
					document.getElementById("formConsos").value === "on"
						? 1
						: 0,
				begin_date: document.getElementById("formBeginDate").value,
				end_date:
					document.getElementById("hasEndDate").value === "on"
						? document.getElementById("formEndDate").value
						: null,
				sponso:
					document.getElementById("formSponso").value === "on" ? 1 : 0
			});
			console.log(body);
			// fetch(`http://k1r2p10.42mulhouse.fr:4242/event/${param.data.id}`, {
			// 	header: {"Content-Type": "application/json"},
			// 	body: body,
			// 	method: "PATCH"
			// });
			setLocked(true);
			setUpdate(true);
		}
	};

	useEffect(() => {
		let tmp = {...param.data};
		tmp.hasEndDate = param.data.end_date !== null;
		console.log(tmp);
		setFormState(tmp);
	}, []);

	useEffect(() => {
		setUpdate(false);
		if (locked)
			setButton(
				<Button
					type="button"
					defaultValue={param.index}
					onClick={switchLock}
				>
					Edit
				</Button>
			);
		else
			setButton(
				<Button
					type="button"
					defaultValue={param.index}
					onClick={saveEvent}
				>
					Save
				</Button>
			);
	}, [param, update, isCheckedDate]);

	return (
		<>
			<Accordion.Header>
				{formState.name} {formState.begin_date}
			</Accordion.Header>
			<Accordion.Body>
				{" "}
				<Form>
					<Form.Label>Name : </Form.Label>
					<Form.Control
						disabled={locked}
						type="text"
						id="formName"
						autoFocus="autofocus"
						defaultValue={formState.name}
					/>
					<Form.Label> Dates : </Form.Label>
					<Form.Control
						id="formBeginDate"
						disabled={locked}
						type="datetime-local"
						defaultValue={formState.begin_date}
					/>
					{" - "}
					<Form.Control
						id="formEndDate"
						disabled={locked}
						defaultValue={formState.end_date}
						type="datetime-local"
					/>
					<Form.Switch
						disabled={locked}
						id="hasEndDate"
						checked={isCheckedDate}
						onChange={() => {
							handleCheckDate();
						}}
					/>
					<Form.Label>Description : </Form.Label>
					<Form.Control
						defaultValue={formState.desc}
						disabled={locked}
						id="formDesc"
					/>
					<Form.Label>Prix : </Form.Label>
					<Form.Control
						disabled={locked}
						type="number"
						min="0"
						step="0.01"
						id="formCost"
						defaultValue={formState.cost}
					/>{" "}
					€ (
					<Form.Control
						disabled={locked}
						type="number"
						min="0"
						id="formPremiumCost"
						step="0.01"
						defaultValue={formState.premium_cost}
					/>
					€ )<Form.Label>Places : </Form.Label>
					{" ? / "}
					<Form.Control
						disabled={locked}
						type="number"
						id="formNbPlaces"
						min="1"
						defaultValue={formState.nb_places}
					/>
					<Form.Label>Lieu : </Form.Label>
					<Form.Control
						disabled={locked}
						type="text"
						id="formPlace"
						defaultValue={formState.place}
					/>
					<Form.Switch
						disabled={locked}
						id="formIsOutside"
						label="Outside"
					/>
					<Form.Switch
						disabled={locked}
						id="formSponso"
						label="Sponsorised"
					/>
					<Form.Switch
						disabled={locked}
						id="formConsos"
						label="Consommation"
					/>
					{button}
					<Button type="reset" disabled={locked}>
						Reset
					</Button>
				</Form>
			</Accordion.Body>
		</>
	);
};

export default AdminEventToken;
