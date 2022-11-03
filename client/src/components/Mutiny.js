import {useState, useEffect} from "react";
import {NotificationManager} from "react-notifications";

const Mutiny = () => {
	const [userList, setUserList] = useState([]);
	const [selectedUser, setSelectedUser] = useState("");

	const tricorn = () => {
		if (userList.some(i => i.login.includes(selectedUser)))
			fetch(
				`${process.env.REACT_APP_API_URL}/stud/admin/${selectedUser}/mutiny`,
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
					NotificationManager.success(
						`Passation de pouvoir effectuée vers ${selectedUser}`,
						"Validation",
						5000
					);
				})
				.catch(function(error) {
					NotificationManager.error(
						"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
						"Erreur",
						5000
					);
				});
	};

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/stud/admin/members`, {
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
	}, []);

	return (
		<>
			<datalist id="user_list">
				{userList.map((user, i) => (
					<option key={i} value={user.login} />
				))}
			</datalist>
			<input
				list="user_list"
				value={selectedUser}
				onChange={e => setSelectedUser(e.target.value)}
			/>
			<button onClick={tricorn}>Léguer le tricorne de Capitaine</button>
		</>
	);
};

export default Mutiny;
