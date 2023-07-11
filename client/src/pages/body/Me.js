import React from "react";
import {useState, useEffect} from "react";
import {NotificationManager} from "react-notifications";

import UserProfile from "../../components/UserProfile";

const Me = () => {
	const [login, setLogin] = useState("");

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/session`, {
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
				if (data.login !== -42) setLogin(data.login);
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, []);

	return <UserProfile login={login} me />;
};

export default Me;
