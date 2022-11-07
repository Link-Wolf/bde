import {useState, React, useEffect} from "react";
import AdminNavbar from "../../components/AdminNavbar";
import CheckSet from "../../components/CheckSet";
import AdminLogList from "../../components/AdminLogList";

import style from "../../style/AdminLogs.module.scss";

const AdminLogs = () => {
	const [filter, setFilter] = useState({
		warn: true,
		error: true,
		isAdmin: false,
		sort: "date",
		asc: false,
		login: ""
	});

	const handleFormChange = event => {
		let tempFilter = {...filter};
		const target = event.target;
		const value =
			target.type === "checkbox" ? target.checked : target.value;
		const name = target.name;
		tempFilter[name] = value;
		setFilter(tempFilter);
	};

	const handleButtonChange = () => {
		let tempFilter = {...filter};
		tempFilter["asc"] = !filter.asc;
		setFilter(tempFilter);
	};

	const filterHanddler = () => {
		if (document.getElementById(style.dropdown).style.display === "block")
			document.getElementById(style.dropdown).style.display = "none";
		else document.getElementById(style.dropdown).style.display = "block";
		if (document.getElementById(style.dropdownBg).style.display === "block")
			document.getElementById(style.dropdownBg).style.display = "none";
		else document.getElementById(style.dropdownBg).style.display = "block";
	};

	return (
		<div
			style={{
				display: "flex"
			}}
		>
			<AdminNavbar />
			<div className={style.logsContainer}>
				<div id={style.tittle}>Logs</div>
				<div className={style.dropdownContainer}>
					<button id={style.dropdownButton} onClick={filterHanddler}>
						Filtrer
					</button>
					<div id={style.dropdownBg} onClick={filterHanddler}></div>
					<div id={style.dropdown}>
						<CheckSet
							set={[
								{
									label: "Warn",
									name: "warn",
									checked: filter.warn
								},
								{
									label: "Error",
									name: "error",
									checked: filter.error
								},
								{
									label: "Admin",
									name: "isAdmin",
									checked: filter.isAdmin
								}
							]}
							onChange={handleFormChange}
							type="checkbox"
						/>
						<hr />
						<label id={style.login}>Filtrer par login :</label>
						<input
							autoFocus={true}
							placeholder="Login"
							name="login"
							onChange={handleFormChange}
						/>
						<hr />
						<div>
							<label id={style.tri}>Trier par : </label>
						</div>
						<label id={style.triDate}>Date </label>
						<button onClick={handleButtonChange}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 14 14"
							>
								<g>
									<polyline
										points="2.5 3.5 5.5 0.5 5.5 13.5"
										fill="none"
										stroke={
											filter.asc
												? "var(--primary-dark)"
												: "var(--secondary-dark)"
										}
										strokeWidth="10%"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<polyline
										points="11.5 10.5 8.5 13.5 8.5 0.5"
										fill="none"
										stroke={
											!filter.asc
												? "var(--primary-dark)"
												: "var(--secondary-dark)"
										}
										strokeWidth="10%"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</g>
							</svg>
						</button>
					</div>
				</div>
				<AdminLogList filter={filter} />
			</div>
		</div>
	);
};

export default AdminLogs;
