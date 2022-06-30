import {useEffect, useState} from "react";

import {Accordion, Button, Form} from "react-bootstrap";

const AdminEventToken = param => {
	const [formState, setFormState] = useState({});
	const [initForm, setInitForm] = useState(true);
	const [locked, setLocked] = useState(true);
	const [button, setButton] = useState(<></>);
	const [update, setUpdate] = useState(false);

	const switchLock = () => {
		setLocked(false);
		setUpdate(true);
	};

	const saveEvent = () => {
		if (window.confirm(`Desire tu modifier l'event ${param.data.name}`));
		{
			fetch("http://k1r2p10.42mulhouse.fr:4242/event", {
				header: {"Content-Type": "application/json"},
				body: {
					name: document.getElementById("formName").value,
					cost: document.getElementById("formCost").value,
					place: document.getElementById("formPlace").value,
					premium_cost: document.getElementById("formPremiumCost")
						.value,
					nb_places: document.getElementById("formNbPlaces").value,
					desc: document.getElementById("formDesc").value,
					isOutside: document.getElementById("formIsOutside").value,
					consos:
						document.getElementById("formConsos").value === "on"
							? 1
							: 0,
					begin_date:
						document.getElementById("formBeginDate").value === "on"
							? 1
							: 0,
					end_date: document.getElementById("hasEndDate").value
						? document.getElementById("formEndDate").value
						: null,
					sponso:
						document.getElementById("formSponso").value === "on"
							? 1
							: 0
				},
				method: "PATCH"
			});
			setLocked(true);
			setUpdate(true);
		}
	};

	useEffect(() => {
		if (initForm) {
			setInitForm(false);
			let tmp = {...param.data};
			tmp.isEndDate = tmp.end_date != null;
			tmp.end_date = tmp.end_date ? tmp.end_date : "";
			setFormState(tmp);
		}
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
	}, [param, update, formState]);

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
						type="date"
						defaultValue={formState.begin_date}
					/>
					{" - "}
					<Form.Control
						id="formEndDate"
						disabled={
							locked ||
							!document.getElementById("hasEndDate").value
						}
						defaultValue={formState.end_date}
						type="date"
					/>
					<Form.Check disabled={locked} id="hasEndDate" />
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
						form="formNbPlaces"
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
					<Form.Label> Outside </Form.Label>
					<Form.Check disabled={locked} id="formIsOutside" />
					<Form.Label> Sponsorised </Form.Label>
					<Form.Check disabled={locked} id="formSponso" />
					<Form.Label> Consommation </Form.Label>
					<Form.Check disabled={locked} id="formConsos" />
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
