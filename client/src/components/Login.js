import {useSearchParams, Navigate} from "react-router-dom";
import {NotificationManager} from "react-notifications";
import {useState, useEffect} from "react";

const Login = () => {
	const [searchParams] = useSearchParams();
	const [ret, setRet] = useState(<></>);

	useEffect(() => {
		const code = searchParams.get("code");
		const requestOptions = {
			method: "POST",
			credentials: "include",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				code: code
			})
		};
		fetch(`${process.env.REACT_APP_API_URL}/auth`, requestOptions)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ` +
							`${response.status}`
					);
				}
			})
			.then(() => {
				fetch(`${process.env.REACT_APP_API_URL}/session`, {
					credentials: "include"
				})
					.then(response => {
						if (!response.ok) {
							throw new Error(
								`This is an HTTP error: The status is ` +
									`${response.status}`
							);
						}
					})
					.catch(function(error) {
						NotificationManager.error(
							"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
							"Erreur",
							5000
						);
					});
			})
			.then(() => {
				window.location.replace(
					localStorage.getItem("toRedirectLogin") || "/home"
				);
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, [searchParams]);

	return ret;
};

export default Login;
