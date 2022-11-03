import React, {useState, useEffect} from "react";

const Stud = () => {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/stud`, {
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
									{user.isAdmin
										? "Admin"
										: user.clearance == 9
										? "Volontaire"
										: "Student"}
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
