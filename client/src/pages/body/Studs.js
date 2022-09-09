import React, {useState, useEffect} from "react";

const Stud = () => {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/stud`, {
			credentials: "include"
		})
			.then(response => {
				return response.json();
			})

			.then(data => {
				setUsers(data);
			});
	}, []);

	return (
		<div>
			{users.length > 0 && (
				<ul>
					{users.map(user => (
						<li key={user.login}>
							{user.login}
							<ul>
								<li>{user.firstname}</li>
								<li>{user.lastname}</li>
								<li>
									{user.isDirection ? "direction" : "pnj"}
								</li>
							</ul>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Stud;
