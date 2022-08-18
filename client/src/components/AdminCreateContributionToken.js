import {useState, useEffect, React} from "react";
import {Navigate} from "react-router-dom";
import {Button} from "react-bootstrap";
import {Store} from "react-notifications-component";

const AdminCreateContributionToken = () => {
	const [ret, setRet] = useState(<></>);
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

	const saveNewContrib = async () => {
		if (new Date(bodyState.end_date) <= new Date(bodyState.begin_date)) {
			Store.addNotification({
				title: "Contribution",
				message: "Error, end_date must be after begin_date",
				type: "danger",
				insert: "top",
				container: "top-right",
				animationIn: ["animate__animated", "animate__fadeIn"],
				animationOut: ["animate__animated", "animate__fadeOut"],
				dismiss: {
					duration: 5000
				}
			});
		} else {
			await fetch(
				`http://${global.config.api.authority}/contribution/admin`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(bodyState)
				}
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
			window.location.reload();
			setRet(<Navigate to={"/admin/contributions"} />);
			Store.addNotification({
				title: "Contribution",
				message: "Successfully created the new contribution",
				type: "success",
				insert: "top",
				container: "top-right",
				animationIn: ["animate__animated", "animate__fadeIn"],
				animationOut: ["animate__animated", "animate__fadeOut"],
				dismiss: {
					duration: 5000
				}
			});
		}
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
					required
				/>
				<label>Prix :</label>
				<input
					value={formState.price}
					name="cost"
					type="number"
					min="0"
					step="0.01"
					onChange={handleFormChange}
					required
				/>
				<label>Dates : </label>
				<input
					value={formState.begin_date}
					name="begin_date"
					type="date"
					onChange={handleFormChange}
					required
				/>
				<label>-</label>
				<input
					value={formState.end_date}
					name="end_date"
					type="date"
					onChange={handleFormChange}
					required
				/>
				<Button onClick={saveNewContrib}> Save </Button>
			</form>
		</>
	);
};

export default AdminCreateContributionToken;
