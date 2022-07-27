import {useEffect, useState} from "react";
import {Accordion, Button, Form} from "react-bootstrap";

const AdminContribToken = param => {
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
	const [button, setButton] = useState(<></>);
	const [update, setUpdate] = useState(false);

	const switchLock = () => {
		setLocked(false);
		setUpdate(true);
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
		// console.log(tmpBody.begin_date);
		// console.log(tmpBody.end_date);
		setBodyState(tmpBody);
		setFormState(tmp);
	};

	const saveContrib = () => {
		if (window.confirm(`Desire tu modifier la cotisation de ${param.data.studLogin}`))
		{
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
				`http://localhost:4242/contribution/admin/${param.data.studLogin}`,
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
			setLocked(true);
			setUpdate(true);
		}
	};

	const two_digiter = nb => {
		if (nb < 10) return "0" + nb;
		return nb;
	};

	useEffect(() => {
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
	}, []);
	//TODO : fixme daddy (or mommy)

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
					onClick={saveContrib}
				>
					Save
				</Button>
			);
	}, [param.data, param.index, update, formState]);

	return (
		<>
				{formState.name} {formState.begin_date}
				{" "}
				<Form>
					<Form.Label>Stud : </Form.Label>
					<Form.Control
						disabled={true}
						name="studLogin"
						type="text"
						id="formStud"
						autoFocus="autofocus"
						value={formState.studLogin}
						required
					/>
					<Form.Label>Prix : </Form.Label>
					<Form.Control
						disabled={true}
						type="text"
						min="0"
						step="0.01"
						id="formCost"
						value={formState.cost}
						name="cost"
						required
					/>{" "}
					€
					<Form.Label> Dates : </Form.Label>
					<Form.Control
						id="formBeginDate"
						disabled={locked}
						type="datetime-local"
						name="begin_date"
						value={formState.begin_date}
						onChange={handleFormChange}
						required
					/>
					{" - "}
					<Form.Control
						id="formEndDate"
						disabled={locked || !formState.hasEndDate}
						name="end_date"
						value={formState.end_date}
						onChange={handleFormChange}
						type="datetime-local"
						required
					/>
					{button}
				</Form>
		</>
	);
};

export default AdminContribToken;
