import {useState, useEffect} from "react";
import {NotificationManager} from "react-notifications";

import style from "../style/AdminUnpaidManagement.module.scss";

/**
 *	@brief Handle the search bar and the menu to add a student to the
 *		unpaid list (like admin but less powerfull)
 *	@param {Object} param	Contains the function to update the list of admins
 *		to the parent component
 *	@return {JSX} Return the JSX to display
 */
const AddUnpaidSearchBar = param => {
	const [userList, setUserList] = useState([]);
	const [selectedUser, setSelectedUser] = useState("");
	const [update, setUpdate] = useState(false);

	/**
	 * @brief Promote a student to the unpaid list
	 */
	const promoteUser = () => {
		if (userList.some(i => i.login.includes(selectedUser)))
			fetch(
				`${process.env.REACT_APP_API_URL}/stud/volunteers/promote/${selectedUser}`,
				{
					credentials: "include",
					method: "PATCH"
				}
			)
				.then(response => {
					if (!response.ok) {
						throw new Error(
							`This is an HTTP error: The status is ${response.status}`
						);
					}
					return;
				})
				.then(() => {
					param.setUpdate(true);
					setUpdate(true);
					NotificationManager.success(
						`Le student ${selectedUser} est ajouté aux volontaires`,
						"Validation",
						5000
					);
					setSelectedUser("");
				})
				.catch(function(error) {
					NotificationManager.error(
						"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
						"Erreur",
						5000
					);
				});
	};

	/**
	 *	@brief Fetch the list of students that are not volunteers
	 *		(they have to be connected at least once)
	 */
	useEffect(() => {
		setUpdate(false);
		fetch(`${process.env.REACT_APP_API_URL}/stud/admin/noVolunteers`, {
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
		<div id={style.searchBar}>
			<label>Login du student à ajouter aux volontaires</label>
			<label id={style.details}>
				(il doit s'être connecté au moins une fois)
			</label>
			<div>
				<datalist id="unpaid_list">
					{userList.map((user, i) => (
						<option key={i} value={user.login} />
					))}
				</datalist>
				<input
					list="unpaid_list"
					value={selectedUser}
					onChange={e => setSelectedUser(e.target.value)}
				/>
				<button onClick={promoteUser}>Promouvoir</button>
			</div>
		</div>
	);
};

export default AddUnpaidSearchBar;
