import {useState, useEffect} from "react";

const AddDirectionSearchBar = () => {
	const [userList, setUserList] = useState([]);
	const [selectedUser, setSelectedUser] = useState("");

	const promoteUser = () => {
		if (userList.some(i => i.login.includes(selectedUser)))
			fetch(
				`http://${global.config.api.authority}/stud/admin/promote/${selectedUser}`,
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
					//maybe refresh
				})
				.catch(function(error) {
					console.log(
						"Il y a eu un problème avec l'opération fetch: " +
							error.message
					);
				});
	};

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/stud/admin/noDirection`, {
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
