import {useState, useEffect} from "react";
import {NotificationManager} from "react-notifications";

const AddDirectionSearchBar = param => {
	const [userList, setUserList] = useState([]);
	const [selectedUser, setSelectedUser] = useState("");
	const [update, setUpdate] = useState(false);

	const promoteUser = () => {
		if (userList.some(i => i.login.includes(selectedUser)))
			fetch(
				`http://${global.config.api.authority}/stud/unpaid/promote/${selectedUser}`,
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
						`Successfully added ${selectedUser} to direction`,
						"Validation",
						3000
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
		fetch(`http://${global.config.api.authority}/stud/admin/noUnpaid`, {
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
		</>
	);
};

export default AddDirectionSearchBar;
