import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";

import yellowStar from "../../assets/logos/yellow_star.svg";
import greyStar from "../../assets/logos/grey_star.svg";

const AdminStudents = () => {
	const [data, setData] = useState([]);
	const [isFiltered, setIsFiltered] = useState(false);

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/stud`, {
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
				console.log(actualData);
				setData(actualData);
			})
			.catch(function(error) {
				console.log(
					`This is a fetch error: The error is ${error.message}`
				);
			});
	}, []);

	return (
		<div
			style={{
				display: "flex"
			}}
		>
			<AdminNavbar />
			<div>
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
					{data.length > 0 && (
						<ul>
							{data.map(
								user =>
									(!isFiltered || user.isPremium) && (
										<li key={user.login}>
											{user.login}
											<ul>
												<li>
													{user.firstname}{" "}
													{user.lastname}
												</li>
												<li>
													<img
														src={
															user.isPremium
																? yellowStar
																: greyStar
														}
													/>
												</li>
												<li>
													{
														{
															[2]: "Autre Campus",
															[5]: "Piscineux",
															[7]: "Student",
															[9]: "Benevole",
															[11]: "Membre du Bureau",
															[21]: "President",
															[42]: "Devlopper"
														}[user.clearance]
													}
												</li>
											</ul>
										</li>
									)
							)}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};

export default AdminStudents;
