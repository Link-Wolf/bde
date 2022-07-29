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
			// credentials: "tkt on prend tout ;) UwU OwO @w@ TwT $w$ ewe",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				code: code
			})
		};
		fetch("http://localhost:4242/auth", requestOptions)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: ` +
							`The status is ${response.status}`
					);
				}
				// console.log("1 : " + response.headers.get("Set-Cookie")); //cookie is not defined
				// console.log("2 : ", response.headers.get("Content-Type"))
			})
			.then(async () => {
				let loop = true;
				let breakLoop = () => {
					loop = false;
				};
				while (loop) {
					await fetch("http://localhost:4242/session", {
						credentials: "include"
					})
						.then(response => {
							if (!response.ok) {
								throw new Error(
									`This is an HTTP error: The status is ` +
										`${response.status}`
								);
							}
							return response.json();
						})
						.then(data => {
							console.log(data);
							if (data.clearance !== 0) breakLoop();
						});
					await new Promise(res => setTimeout(res, 1000));
				}
			})
			.then(() => {
				setTimeout(() => {
					setRet(<Navigate to={-1} replace={true} />);
				}, 1000);
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
