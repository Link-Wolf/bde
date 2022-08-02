import React from "react";
import {useState, useEffect} from "react";

import UserProfile from "../../components/UserProfile";

const Me = () => {
	const [login, setLogin] = useState("");
	const [ret, setRet] = useState(<></>);

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/session`, {
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
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, []);

	useEffect(() => {
		setRet(<UserProfile login={login} />);
	}, [login]);

	return ret;
};

export default Me;
