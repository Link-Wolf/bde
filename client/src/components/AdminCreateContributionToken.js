import {useState, useEffect, React} from "react";

const AdminCreateContributionToken = () => {
	const [formState, setFormState] = useState({
		login: "",
		begin_date: "",
		end_date: "",
		cost: 0
	});
	const [bodyState, setBodyState] = useState({
		login: "",
		begin_date: "",
		end_date: "",
		cost: 0
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
		let begin_date = new Date(Date.parse(tmp.begin_date));
		let end_date = new Date(Date.parse(tmp.end_date));
		let tmpBody = {...tmp};
		tmpBody.end_date =
			two_digiter(end_date.getFullYear()) +
			"-" +
			two_digiter(end_date.getMonth() + 1) +
			"-" +
			two_digiter(end_date.getDate()) +
			"T" +
			two_digiter(end_date.getHours()) +
			":" +
			two_digiter(end_date.getMinutes());
		tmpBody.begin_date =
			two_digiter(begin_date.getFullYear()) +
			"-" +
			two_digiter(begin_date.getMonth() + 1) +
			"-" +
			two_digiter(begin_date.getDate()) +
			"T" +
			two_digiter(begin_date.getHours()) +
			":" +
			two_digiter(begin_date.getMinutes());
		setBodyState(tmpBody);
		setBodyState(tmpBody);
		setFormState(tmp);
	};

	const two_digiter = nb => {
		if (nb < 10) return "0" + nb;
		return nb;
	};

	const saveNewContrib = () => {
		fetch(`http://${global.config.api.authority}/contribution/admin`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(bodyState)
		});
	};

	return (
		<>
			<form>
				<label>Stud :</label>
				<input
					value={formState.login}
					name="login"
					placeholder="yoyostud"
					onChange={handleFormChange}
				/>
				<label>Prix :</label>
				<input
					value={formState.price}
					name="cost"
					type="number"
					min="0"
					step="0.01"
					onChange={handleFormChange}
				/>
				<label>Dates : </label>
				<input
					value={formState.begin_date}
					name="begin_date"
					type="date"
					onChange={handleFormChange}
				/>
				<label>-</label>
				<input
					value={formState.end_date}
					name="end_date"
					type="date"
					onChange={handleFormChange}
				/>
				<button onClick={saveNewContrib}> Save </button>
			</form>
		</>
	);
};

export default AdminCreateContributionToken;
