import {useState, useEffect} from "react";
import {NotificationManager} from "react-notifications";

const Mutiny = () => {
	const [userList, setUserList] = useState([]);
	const [selectedUser, setSelectedUser] = useState("");

	const tricorn = () => {
		if (userList.some(i => i.login.includes(selectedUser)))
			fetch(
				`http://${global.config.api.authority}/stud/admin/${selectedUser}/mutiny`,
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
						`Successfully give the tricorn to ${selectedUser}`,
						"Validation",
						3000
					);
				})
				.catch(function(error) {
					console.log(
						"Il y a eu un problème avec l'opération fetch: " +
							error.message
					);
				});
	};

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/stud/admin/direction`, {
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
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
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
