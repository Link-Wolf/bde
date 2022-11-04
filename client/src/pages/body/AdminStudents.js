import {useState, useEffect, React} from "react";
import usePagination from "../../components/Pagination";
import {Pagination} from "@mui/material";
import AdminNavbar from "../../components/AdminNavbar";
import {NotificationManager} from "react-notifications";

import yellowStar from "../../assets/logos/yellow_star.svg";
import greyStar from "../../assets/logos/grey_star.svg";

import style from "../../style/AdminStudents.module.scss";

const AdminStudents = () => {
	const PER_PAGE = 21;
	const [data, setData] = useState([]);
	const [isFiltered, setIsFiltered] = useState(false);
	const [page, setPage] = useState(1);
	const [count, setCount] = useState(0);
	const viewData = usePagination(data, PER_PAGE);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/stud`, {
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
			.then(actualData => {
				setData(actualData);
				setCount(Math.ceil(actualData.length / PER_PAGE));
				viewData.updateData(actualData);
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, []);

	const handleChangePage = (e, p) => {
		setPage(p);
		viewData.jump(p);
	};

	return (
		<div
			style={{
				display: "flex"
			}}
		>
			<AdminNavbar />
			<div className={style.studListContainer}>
				<h1> AdminPannel Students part </h1>
				<button
					onClick={() => {
						setIsFiltered(!isFiltered);
					}}
				>
					{isFiltered
						? "Montrer tout le monde"
						: "Montrer les premiums"}
				</button>
				<div>
					<table className={style.table}>
						<thead>
							<tr>
								<th className={style.login}>login</th>
								<th className={style.name}>Nom Prénom</th>
								<th className={style.priv}>Privilège</th>
								<th className={style.auth}>Autorisations</th>
							</tr>
						</thead>
						{data.length > 0 ? (
							viewData.currentData().map(
								user =>
									(!isFiltered || user.isPremium) && (
										<tr key={user.login}>
											<td className={style.login}>
												{user.login}
											</td>
											<td className={style.name}>
												{user.firstname} {user.lastname}
											</td>
											<td className={style.priv}>
												<img
													src={
														user.isPremium
															? yellowStar
															: greyStar
													}
												/>
											</td>
											<td className={style.auth}>
												{
													{
														[2]: "Autre Campus",
														[5]: "Piscineux",
														[7]: "Student",
														[9]: "Bénévole",
														[11]: "Admin",
														[21]: "Capitaine",
														[42]: "0uebM@st3r"
													}[user.clearance]
												}
											</td>
										</tr>
									)
							)
						) : (
							<tr>
								<td colSpan={4}>Aucuns utilisateurs</td>
							</tr>
						)}
					</table>
					<Pagination
						count={count}
						page={page}
						onChange={handleChangePage}
					/>
				</div>
			</div>
		</div>
	);
};

export default AdminStudents;
