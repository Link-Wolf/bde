import {useState, useEffect} from "react";
import useConfirm from "../components/useConfirm";
import {NotificationManager} from "react-notifications";

import style from "../style/AdminCaptainManagement.module.scss";

const Mutiny = () => {
	const {isConfirmed} = useConfirm();

	const [userList, setUserList] = useState([]);
	const [selectedUser, setSelectedUser] = useState("");

	const tricorn = async () => {
		console.log("test");
		if (userList.some(i => i.login.includes(selectedUser))) {
			if (
				await isConfirmed(
					`Voulez vous vraiment léguer vos pouvoirs de capitaine à ${selectedUser} ? Cette action est irréversible !`
				)
			) {
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
					.then(() => {
						window.location = "/home";
					})
					.catch(function(error) {
						NotificationManager.error(
							"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
							"Erreur",
							5000
						);
					});
			}
		}
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
		<div id={style.searchBarMutiny}>
			<div>
				<label>
					Login du student à qui transférer vos pouvoirs de Capitaine
				</label>
			</div>
			<div>
				<label id={style.details}>
					(il doit s'être connecté au moins une fois et déjà être
					administrateur)
				</label>
			</div>
			<div id={style.mutinyField}>
				<datalist id="user_list">
					{userList.map((user, i) => (
						<option key={i} value={user.login} />
					))}
				</datalist>
				<div>
					<input
						list="user_list"
						value={selectedUser}
						onChange={e => setSelectedUser(e.target.value)}
					/>
				</div>
				<button onClick={tricorn}>
					Léguer le tricorne de Capitaine
				</button>
			</div>
		</div>
	);
};

export default Mutiny;
