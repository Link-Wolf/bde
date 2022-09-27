import {useState, useEffect, React} from "react";
import AdminNavbar from "../../components/AdminNavbar";
import useConfirm from "../../components/useConfirm";
import {NotificationManager} from "react-notifications";

import AddUnpaidSearchBar from "../../components/AddUnpaidSearchBar";
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
			`http://${global.config.api.authority}/stud/admin/unpaid`,
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
			`http://${global.config.api.authority}/stud/unpaid/yeet/${toYeet}`,
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
		if (await isConfirmed(`Voulez vous virer ${login} des unpaids ?`)) {
			yeetConfirm(login);
			NotificationManager.success(
				`Successfully yeet ${login} to direction`,
				"Validation",
				3000
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
			<div>
				<AddUnpaidSearchBar
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
					: "On a pas de unpaid helpers"}
			</div>
		</div>
	);
};

export default AdminCaptainManagement;