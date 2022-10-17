import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";
import useConfirm from "../../components/useConfirm";
import {NotificationManager} from "react-notifications";

import AddDirectionSearchBar from "../../components/AddDirectionSearchBar";
import Mutiny from "../../components/Mutiny";

const AdminCaptainManagement = () => {
	const {isConfirmed} = useConfirm();

	const [data, setData] = useState([]);
	const [update, setUpdate] = useState(false);

	useEffect(() => {
		setUpdate(false);
		const requestOptions = {
			method: "get",
			credentials: "include"
		};
		fetch(
			`http://${global.config.api.authority}/stud/admin/direction`,
			requestOptions
		)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(actualData => {
				setData(actualData);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [update]);

	const yeetConfirm = toYeet => {
		const requestOptions = {
			method: "PATCH",
			credentials: "include"
		};
		fetch(
			`http://${global.config.api.authority}/stud/admin/yeet/${toYeet}`,
			requestOptions
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
				setUpdate(true);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	};

	const yeetMember = async login => {
		if (
			await isConfirmed(
				`Voulez vous exclure ${login} du bureau de direction ?`
			)
		) {
			if (
				await isConfirmed(
					`Voulez vous VRAIMENT exclure ${login} du bureau de direction ?`
				)
			) {
				if (
					await isConfirmed(
						`Êtes vous absolument certain de vouloir exclure ${login} du bureau de direction ? Cette action est réversible`
					)
				) {
					if (
						await isConfirmed(
							`Il est encore temps de changer d'avis. Exclure non-définitivement ${login} du bureau de direction ?`
						)
					) {
						if (
							!(await isConfirmed(
								`Souhaiteriez vous ne pas exclure ${login} du bureau de direction et annuler l'opération ?`
							))
						) {
							yeetConfirm(login);
							NotificationManager.success(
								`${login} a bien été exclu du bureau de direction`,
								"Validation",
								5000
							);
						}
					}
				}
			}
		}
	};

	return (
		<div
			style={{
				display: "flex"
			}}
		>
			<AdminNavbar />
			<div>
				<AddDirectionSearchBar
					setUpdate={d => {
						setUpdate(d);
					}}
				/>
				{data.length > 0
					? data.map(item => (
							<li key={item.login}>
								<label>{item.login} </label>
								<label>{item.firstname} </label>
								<label>{item.lastname} </label>
								<button
									onClick={() => {
										yeetMember(item.login);
									}}
								>
									X
								</button>
							</li>
					  ))
					: "Le Bureau est vide"}
				<Mutiny />
			</div>
		</div>
	);
};

export default AdminCaptainManagement;
