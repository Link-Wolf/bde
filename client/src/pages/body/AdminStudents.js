import {useState, useEffect, React} from "react";
import usePagination from "../../components/Pagination";
import {Pagination} from "@mui/material";
import AdminNavbar from "../../components/AdminNavbar";

import yellowStar from "../../assets/logos/yellow_star.svg";
import greyStar from "../../assets/logos/grey_star.svg";

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
				console.log(
					`This is a fetch error: The error is ${error.message}`
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
					<Pagination
						count={count}
						page={page}
						onChange={handleChangePage}
					/>
					{data.length > 0 && (
						<ul>
							{viewData.currentData().map(
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
															[9]: "Bénévole",
															[11]: "Admin",
															[21]: "Capitaine",
															[42]: "0uebM@st3r"
														}[user.clearance]
													}
												</li>
											</ul>
										</li>
									)
							)}
						</ul>
					)}
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
