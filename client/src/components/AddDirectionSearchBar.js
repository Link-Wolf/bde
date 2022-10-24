import {useState, useEffect} from "react";
import {NotificationManager} from "react-notifications";

const AddDirectionSearchBar = param => {
	const [userList, setUserList] = useState([]);
	const [selectedUser, setSelectedUser] = useState("");
	const [update, setUpdate] = useState(false);

	const promoteUser = () => {
		if (userList.some(i => i.login.includes(selectedUser)))
			fetch(
				`${process.env.REACT_APP_API_URL}/stud/admin/promote/${selectedUser}`,
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
						`Student ${selectedUser} ajouté au bureau directeur`,
						"Validation",
						5000
					);
					setSelectedUser("");
				})
				.catch(function(error) {
					console.log(
						"Il y a eu un problème avec l'opération fetch: " +
							error.message
					);
				});
	};

	useEffect(() => {
		setUpdate(false);
		fetch(`${process.env.REACT_APP_API_URL}/stud/admin/noDirection`, {
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
	}, [update]);

	return (
		<>
			<datalist id="captain_list">
				{userList.map((user, i) => (
					<option key={i} value={user.login} />
				))}
			</datalist>
			<input
				list="captain_list"
				value={selectedUser}
				onChange={e => setSelectedUser(e.target.value)}
			/>
			<button onClick={promoteUser}>Promouvoir</button>
		</>
	);
};

export default AddDirectionSearchBar;
