import {useSearchParams, Navigate} from "react-router-dom";
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
		fetch(`http://${global.config.api.authority}/auth`, requestOptions)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ` +
							`${response.status}`
					);
				}
			})
			.then(() => {
				fetch(`http://${global.config.api.authority}/session`, {
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
						console.log(
							"Il y a eu un problème avec l'opération fetch: " +
								error.message
						);
					});
			})
			.then(() => {
				window.location.replace(
					localStorage.getItem("toRedirectLogin") || "/home"
				);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [searchParams]);

	return ret;
};

export default Login;
