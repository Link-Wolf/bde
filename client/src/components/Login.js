import {useSearchParams, Navigate} from "react-router-dom";
import {useState, useEffect} from "react";

const Login = () => {
	const [searchParams] = useSearchParams();
	const [ret, setRet] = useState(<></>);
	const [tries, setTries] = useState(0);

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
		fetch(`http://${global.config.api.authority}/auth`, requestOptions)
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
				while (loop && tries < 10) {
					await fetch(
						`http://${global.config.api.authority}/session`,
						{
							credentials: "include"
						}
					)
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
							if (data.clearance !== 0) breakLoop();
						});
					setTries(tries + 1);
					await new Promise(res => setTimeout(res, 100));
				}
				if (tries >= 10) {
					setRet(<Navigate to="/home?errno=1" replace={true} />);
				}
			})
			.then(() => {
				if (tries < 10) setRet(<Navigate to={-1} replace={true} />);
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
