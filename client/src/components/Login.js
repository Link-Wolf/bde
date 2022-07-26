import {useSearchParams, Navigate} from "react-router-dom";
import {useState, useEffect} from "react";

const Login = () => {
	const [searchParams] = useSearchParams();
	const [login, setLogin] = useState(undefined);
	const [ret, setRet] = useState(<></>);

	useEffect(() => {
		console.log("o");

		const code = searchParams.get("code");
		const requestOptions = {
			method: "post",
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
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				// console.log("1 : " + response.headers.get("Set-Cookie")); //cookie is not defined
				// console.log("2 : ", response.headers.get("Content-Type"));
				for (let entry of response.headers.entries()) {
					console.log("header", entry);
				}
				return response.json();
			})
			.then(actualData => {
				// console.log(actualData.token);
				setLogin(actualData.login);
			})
			.then(async () => {
				console.log("b");
				while (1) {
					console.log("a");
					let a = await fetch("http://localhost:4242/clearance", {
						credentials: "include"
					});
					if (a !== undefined) setRet(<Navigate to={-1} replace={true} />);
					//a
					console.log(`here isssss ${a}`);
					await new Promise(resolve => setTimeout(resolve, 100));
				}
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " + error.message
				);
			});
	}, []);

	useEffect(() => {
		console.log(login);
		// setRet(<Navigate to={-1} replace={true} />);
	}, [login]);

	return ret;
};

export default Login;
