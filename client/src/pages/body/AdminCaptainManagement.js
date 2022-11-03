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
			`${process.env.REACT_APP_API_URL}/stud/admin/members`,
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
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, [update]);

	const yeetConfirm = toYeet => {
		const requestOptions = {
			method: "PATCH",
			credentials: "include"
		};
		fetch(
			`${process.env.REACT_APP_API_URL}/stud/admin/yeet/${toYeet}`,
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
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	};

	const yeetMember = async login => {
		if (
			await isConfirmed(
				`Voulez vous exclure ${login} des administrateur·trice·s ?`
			)
		) {
			if (
				await isConfirmed(
					`Voulez vous VRAIMENT exclure ${login} des administrateur·trice·s ?`
				)
			) {
				if (
					await isConfirmed(
						`Êtes vous absolument certain de vouloir exclure ${login} des administrateur·trice·s ? Cette action est réversible`
					)
				) {
					if (
						await isConfirmed(
							`Il est encore temps de changer d'avis. Exclure non-définitivement ${login} des administrateur·trice·s ?`
						)
					) {
						if (
							!(await isConfirmed(
								`Souhaiteriez vous ne pas exclure ${login} des administrateur·trice·s et annuler l'opération ?`
							))
						) {
							yeetConfirm(login);
							NotificationManager.success(
								`${login} a bien été retiré·e des administrateur·trice·s`,
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
					: "Il n'y a aucun administrateur"}
				<Mutiny />
			</div>
		</div>
	);
};

export default AdminCaptainManagement;
