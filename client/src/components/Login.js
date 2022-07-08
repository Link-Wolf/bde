import {useSearchParams, Navigate} from "react-router-dom";
import {useState, useEffect} from "react";

const Login = () => {
	const [searchParams] = useSearchParams();
	const [login, setLogin] = useState({});
	const [ret, setRet] = useState(<></>);

	useEffect(() => {
		const code = searchParams.get("code");
		const requestOptions = {
			method: "post",
			headers: {"Content-Type": "application/json"},
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
				setLogin(actualData.login);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, []);

	useEffect(() => {
		console.log(login);
		setRet(<Navigate to={-1} replace={true} />);
	}, [login]);

	return ret;
};

export default Login;
