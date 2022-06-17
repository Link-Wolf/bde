import React, {useState, useEffect} from "react";

const Stud = () => {
	const [users, setUsers] = useState([]);

	const getStud = () => {
		fetch("http://localhost:4242/stud")
			.then(response => {
				return response.json();
			})

			.then(data => {
				setUsers(data);
			});
	};

	useEffect(() => {
		getStud();
	}, []);

	return (
		<div>
			{users.length > 0 && (
				<ul>
					{users.map(user => (
						<li key={user.login}>{user.login}</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Stud;
