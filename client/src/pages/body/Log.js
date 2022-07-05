import {useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import jwt_decode from "jwt-decode";

import UserContext from "../../contexts/user.context";

const Log = data => {
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const code = searchParams.get("code");
		const requestOptions = {
			method: "post",
			headers: {"Content-Type": "application/json"}, //add security token here i guess
			body: JSON.stringify({
				code: code
			})
		};
		fetch("http://k1r2p10.42mulhouse.fr:4242/auth", requestOptions)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(actualData => {
				// console.log(actualData.token);
				data.context.setUser(jwt_decode(actualData.token));
				data.context.setToken(actualData.token);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, []);

	useEffect(() => {
		console.log(data.context.token, " : ", data.context.user);
	}, [data]);
};

export default Log;
