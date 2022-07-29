import {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";

const AdminEventToken = () => {
	const [formState, setFormState] = useState({
		name: "",
		desc: "",
		begin_date: "",
		end_date: "",
		place: "",
		nb_places: 0,
		cost: 0,
		premium_cost: 0,
		hasEndDate: false,
		sponso: false,
		consos: false,
		isOutside: false,
		for_pool: false
	});
	const [bodyState, setBodyState] = useState({
		name: "",
		desc: "",
		begin_date: "",
		end_date: "",
		place: "",
		nb_places: 0,
		cost: 0,
		premium_cost: 0,
		hasEndDate: false,
		sponso: false,
		consos: false,
		isOutside: false,
		for_pool: false
	});
	const [button, setButton] = useState(<></>);
	const [update, setUpdate] = useState(false);

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
		// console.log(tmpBody.begin_date);
		// console.log(tmpBody.end_date);
		setBodyState(tmpBody);
		setFormState(tmp);
	};

	const two_digiter = nb => {
		if (nb < 10) return "0" + nb;
		return nb;
	};

	useEffect(() => {
		const saveEvent = () => {
			if (window.confirm(`Desire tu creer cet event ?`)) {
				var myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");

				var raw = JSON.stringify({
					name: bodyState.name,
					cost: bodyState.cost,
					place: bodyState.place,
					premium_cost: bodyState.premium_cost,
					nb_places: bodyState.nb_places,
					desc: bodyState.desc,
					isOutside: bodyState.isOutside,
					consos: bodyState.consos,
					sponso: bodyState.sponso,
					begin_date: bodyState.begin_date,
					end_date: bodyState.hasEndDate ? bodyState.end_date : null,
					for_pool: bodyState.for_pool
				});
				if (window.confirm(`${raw}`));

				var requestOptions = {
					method: "POST",
					headers: myHeaders,
					body: raw,
					redirect: "follow",
					credentials: "include"
				};

				fetch(`http://localhost:4242/event/`, requestOptions)
					.then(response => {
						if (!response.ok) {
							throw new Error(
								`This is an HTTP error: The status is ${response.status}`
							);
						}
					})
					.then(() => {
						document.location.reload();
					})
					.catch(function(error) {
						console.log(
							"Il y a eu un problème avec l'opération fetch: " +
								error.message
						);
					});
				setUpdate(true);
			}
		};

		setUpdate(false);
		setButton(
			<Button type="button" defaultValue={-1} onClick={saveEvent}>
				Save
			</Button>
		);
	}, [update, formState, bodyState]);

	return (
		<>
			<Form>
				<Form.Label>Name : </Form.Label>
				<Form.Control
					name="name"
					type="text"
					id="formName"
					autoFocus="autofocus"
					value={formState.name}
					onChange={handleFormChange}
					required
				/>
				<Form.Label> Dates : </Form.Label>
				<Form.Control
					id="formBeginDate"
					type="datetime-local"
					name="begin_date"
					value={formState.begin_date}
					onChange={handleFormChange}
					required
				/>
				{" - "}
				<Form.Control
					id="formEndDate"
					name="end_date"
					disabled={formState.hasEndDate}
					value={formState.end_date}
					onChange={handleFormChange}
					type="datetime-local"
				/>
				<Form.Switch
					name="hasEndDate"
					id="hasEndDate"
					checked={formState.hasEndDate}
					onChange={handleFormChange}
				/>
				<Form.Label>Description : </Form.Label>
				<Form.Control
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
				/>{" "}
				€ (
				<Form.Control
					type="number"
					min="0"
					id="formPremiumCost"
					step="0.01"
					name="premium_cost"
					onChange={handleFormChange}
					value={formState.premium_cost}
				/>
				€ )<Form.Label>Places : </Form.Label>
				{" ? / "}
				<Form.Control
					type="number"
					id="formNbPlaces"
					min="-42"
					name="nb_places"
					onChange={handleFormChange}
					value={formState.nb_places}
				/>
				<Form.Label>Lieu : </Form.Label>
				<Form.Control
					type="text"
					id="formPlace"
					name="place"
					onChange={handleFormChange}
					value={formState.place}
					required
				/>
				<Form.Switch
					id="formIsOutside"
					label="Outside"
					name="isOutside"
					onChange={handleFormChange}
					value={formState.isOutside}
				/>
				<Form.Switch
					id="formSponso"
					label="Sponsorised"
					name="sponso"
					onChange={handleFormChange}
					value={formState.sponso}
				/>
				<Form.Switch
					id="formConsos"
					label="Consommation"
					name="consos"
					onChange={handleFormChange}
					value={formState.consos}
				/>
				<Form.Switch
					id="formForPool"
					label="Pour les piscineux"
					name="for_pool"
					onChange={handleFormChange}
					value={formState.for_pool}
				/>
				{button}
			</Form>
		</>
	);
};

export default AdminEventToken;
