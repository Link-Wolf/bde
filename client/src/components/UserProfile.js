import React from "react";
import {useState, useEffect} from "react";

const UserProfile = options => {
	const [title, setTitle] = useState(<></>);
	// const [eventSubed, setEventSubed] = useState(<></>);
	// const [contributionMarker, setContributionMarker] = useState(<></>);

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
				console.log(data);
				setTitle(
					<>
						<h1>{data.login}</h1>
						<h2>
							{data.firstname} {data.lastname}
						</h2>
					</>
				);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [options]);

	return <>{title}</>;
};

export default UserProfile;
