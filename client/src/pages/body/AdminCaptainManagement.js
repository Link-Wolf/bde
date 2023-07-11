import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";
import useConfirm from "../../components/useConfirm";
import {NotificationManager} from "react-notifications";

import AddDirectionSearchBar from "../../components/AddDirectionSearchBar";
import Mutiny from "../../components/Mutiny";

import style from "../../style/AdminCaptainManagement.module.scss";

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
				`Voulez vous exclure ${login} des administrateurs ?`
			)
		) {
			if (
				await isConfirmed(
					`Voulez vous VRAIMENT exclure ${login} des administrateurs ?`
				)
			) {
				if (
					await isConfirmed(
						`Êtes vous absolument certain de vouloir exclure ${login} des administrateurs ? Cette action est réversible`
					)
				) {
					if (
						await isConfirmed(
							`Il est encore temps de changer d'avis. Exclure non-définitivement ${login} des administrateurs ?`
						)
					) {
						if (
							!(await isConfirmed(
								`Souhaiteriez vous ne pas exclure ${login} des administrateurs et annuler l'opération ?`
							))
						) {
							yeetConfirm(login);
							NotificationManager.success(
								`${login} ne fait à présent plus parti des administrateurs`,
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
			<div className={style.captainManagementContainer}>
				<div id={style.tittle}>
					Gestion des <br /> administrateurs
				</div>
				<AddDirectionSearchBar
					setUpdate={d => {
						setUpdate(d);
					}}
				/>
				{data.length > 0 ? (
					<ul>
						{data.map((item, i) => (
							<li key={i} >
								<ul className={style.adminLine}>
									<li id={style.login}>
										<a href={`/profile/${item.login}`}>
											{item.login}
										</a>{" "}
									</li>
									<li id={style.firstname}>
										{item.firstname}{" "}
									</li>
									<li id={style.lastname}>
										{item.lastname}{" "}
									</li>
									<li id={style.role}>
										{
											{
												[2]: "Autre Campus",
												[5]: "Piscineux",
												[7]: "Student",
												[9]: "Bénévole",
												[11]: "Admin",
												[21]: "Capitaine",
												[42]: "Webmaster"
											}[item.clearance]
										}
									</li>
									<li id={style.yeet}>
										<button
											onClick={() => {
												yeetMember(item.login);
											}}
										>
											❌
										</button>
									</li>
								</ul>
							</li>
						))}
					</ul>
				) : (
					"Il n'y a aucun administrateur"
				)}
				<hr />
				<Mutiny />
			</div>
		</div>
	);
};

export default AdminCaptainManagement;
