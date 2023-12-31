import {useState, useEffect, React} from "react";
import {Button} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import "react-notifications/lib/notifications.css";

/**
 * @brief Create a new contribution for a student
 * @returns {JSX.Element} The page to create a new contribution
 */
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
	const [userList, setUserList] = useState([]);
	const [update, setUpdate] = useState(false);

	/**
	 * @brief Handle the change of the form and update the state
	 */
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

	/**
	 * @brief Add a 0 before a number if it's under 10
	 */
	const two_digiter = nb => {
		if (nb < 10) return "0" + nb;
		return nb;
	};

	/**
	 * @brief Save the new contribution in the database
	 */
	const saveNewContrib = async () => {
		if (new Date(bodyState.end_date) <= new Date(bodyState.begin_date)) {
			NotificationManager.error(
				"La date de début doit précéder la date de fin",
				"Erreur",
				5000
			);
			return;
		}
		if (!userList.some(i => i.login.includes(formState.studLogin))) {
			NotificationManager.error(
				`Le student ${formState.studLogin} n'existe pas`,
				"Erreur",
				5000
			);
			return;
		}
		await fetch(`${process.env.REACT_APP_API_URL}/contribution/admin`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(bodyState)
		})
			.then(response => {
				if (!response.ok) {
					NotificationManager.error(
						"Impossible de créer la contribution, ERR:30903",
						"Erreur",
						5000
					);
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				NotificationManager.success(
					`Nouvelle contributon créée pour ${bodyState.studLogin}`,
					"Validation",
					5000
				);
			})
			.then(() => {
				window.location.reload();
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}; //

	/**
	 * @brief Get the list of all the students to fill the datalist
	 */
	useEffect(() => {
		setUpdate(false);
		fetch(`${process.env.REACT_APP_API_URL}/stud`, {
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
				setUserList(data);
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, [update]);

	return (
		<>
			<datalist id="user_list">
				{userList.map((user, i) => (
					<option key={i} value={user.login} />
				))}
			</datalist>
			<form>
				<label>Stud :</label>
				<input
					list="user_list"
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
					max={formState.end_date}
				/>
				<label>-</label>
				<input
					value={formState.end_date}
					name="end_date"
					type="date"
					onChange={handleFormChange}
					required
					min={formState.begin_date}
				/>
				<Button onClick={saveNewContrib}> Enregistrer </Button>
			</form>
		</>
	);
};

export default AdminCreateContributionToken;
