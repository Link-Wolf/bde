import React from "react";
import {useState, useEffect} from "react";

const UserProfile = options => {
	const [stud, setStud] = useState({});

	useEffect(() => {
		fetch(`http://localhost:4242/stud/${options.login}`, {
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
			.then(data => {
				setStud(data);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " + error.message
				);
			});
	}, []);

	return <h1>{data.login}</h1>;
};

export default UserProfile;
