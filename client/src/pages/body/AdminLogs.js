import {useState, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";
import CheckSet from "../../components/CheckSet";
import {Dropdown} from "react-bootstrap";
import AdminLogList from "../../components/AdminLogList";

const AdminLogs = () => {
	const [filter, setFilter] = useState({
		warn: true,
		error: true,
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

	return (
		<div
			style={{
				display: "flex"
			}}
		>
			<AdminNavbar />
			<div className={`${"flex"}`}>
				<div>
					<Dropdown>
						<Dropdown.Toggle variant="success" id="dropdown-basic">
							Filtrer
						</Dropdown.Toggle>

						<Dropdown.Menu>
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
							<div className="dropdown-divider"></div>
							<div className="form-group">
								<label>Filtrer par login</label>
								<input
									autoFocus={true}
									className="form-control"
									placeholder="Login"
									name="login"
									onChange={handleFormChange}
								/>
							</div>
						</Dropdown.Menu>
					</Dropdown>
					<p> Trier par : </p>
					<label>Date : </label>
					<button onClick={handleButtonChange}>⇃↾</button>
					<AdminLogList filter={filter} />
				</div>
			</div>
		</div>
	);
};

export default AdminLogs;
