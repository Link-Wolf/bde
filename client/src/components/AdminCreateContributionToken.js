import {useState, useEffect, React} from "react";
import {Button} from "react-bootstrap";

const AdminCreateContributionToken = () => {
	const [formState, setFormState] = useState({
		studLogin: "",
		begin_date: "",
		end_date: "",
		cost: 0
	});
	const [bodyState, setBodyState] = useState({
		studLogin: "",
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
			two_digiter(end_date.getDate());
		tmpBody.begin_date =
			two_digiter(begin_date.getFullYear()) +
			"-" +
			two_digiter(begin_date.getMonth() + 1) +
			"-" +
			two_digiter(begin_date.getDate());
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
		})
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
		// window.location.reload();
	};

	return (
		<>
			<form>
				<label>Stud :</label>
				<input
					value={formState.login}
					name="studLogin"
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
				<Button onClick={saveNewContrib}> Save </Button>
			</form>
		</>
	);
};

export default AdminCreateContributionToken;
