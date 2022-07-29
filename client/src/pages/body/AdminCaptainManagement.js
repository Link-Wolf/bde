import {useState, useEffect, React} from "react";

const AdminCaptainManagement = param => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const requestOptions = {
			method: "get",
			credentials: "include"
		};
		fetch(`http://localhost:4242/stud/admin/direction`, requestOptions)
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
	}, []);

	const yeetConfirm = toYeet => {
		const requestOptions = {
			method: "patch",
			credentials: "include"
		};
		fetch(
			`http://localhost:4242/stud/admin/direction/${toYeet}`,
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
			.then(() => {
				//maybe refresh
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	};

	const yeetMember = login => {
		if (
			window.confirm(
				`Voulez vous virer ${login} du bureau de direction ?`
			)
		) {
			if (
				window.confirm(
					`Voulez vous VRAIMENT virer ${login} du bureau de direction ?`
				)
			) {
				if (
					window.confirm(
						`Etes vous absolument certain de vouloir virer ${login} du bureau de direction ?`
					)
				) {
					if (
						window.confirm(
							`Il est encore temps de changer d'avis. Virer ${login} du bureau de direction ?`
						)
					) {
						if (
							!window.confirm(
								`Voulez vous ne pas virer ${login} du bureau de direction et annuler?`
							)
						) {
							yeetConfirm(login);
						}
					}
				}
			}
		}
	};

	return (
		<div>
			{data.map(item => (
				<li key={item.login}>
					<label>{item.login}</label>
					<label>{item.firstname}</label>
					<label>{item.lastname}</label>
					<button
						onClick={() => {
							yeetMember(item.login);
						}}
					>
						X
					</button>
				</li>
			))}
		</div>
	);
};

export default AdminCaptainManagement;
