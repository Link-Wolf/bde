import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";
import useConfirm from "../../components/useConfirm";
import {NotificationManager} from "react-notifications";

import AddUnpaidSearchBar from "../../components/AddUnpaidSearchBar";
import Mutiny from "../../components/Mutiny";

import style from "../../style/AdminUnpaidManagement.module.scss";

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
			`${process.env.REACT_APP_API_URL}/stud/admin/volunteers`,
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
			`${process.env.REACT_APP_API_URL}/stud/volunteers/yeet/${toYeet}`,
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
		if (await isConfirmed(`Voulez vous virer ${login} des unpaids ?`)) {
			yeetConfirm(login);
			NotificationManager.success(
				`Student ${login} exclu des volontaires`,
				"Validation",
				5000
			);
		}
	};

	return (
		<div
			style={{
				display: "flex"
			}}
		>
			<AdminNavbar />
			<div className={style.unpaidManagementContainer}>
				<div id={style.tittle}>Gestion des volontaires</div>
				<AddUnpaidSearchBar
					setUpdate={d => {
						setUpdate(d);
					}}
				/>
				{data.length > 0 ? (
					<ul>
						{data.map(item => (
							<li id={style.eachUnpaid} key={item.login}>
								<ul className={style.unpaidLine}>
									<li id={style.login}>
										<a href={`/profile/${item.login}`}>
											{item.login}
										</a>
									</li>
									<li id={style.firstname}>
										{item.firstname}{" "}
									</li>
									<li id={style.lastname}>
										{item.lastname}{" "}
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
					"Aucun volontaire"
				)}
			</div>
		</div>
	);
};

export default AdminCaptainManagement;
