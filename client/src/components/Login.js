import {useSearchParams, Navigate} from "react-router-dom";
import {useState, useEffect} from "react";
import {ReactSession} from "react-client-session";
import jwt_decode from "jwt-decode";

const Login = () => {
	const [searchParams] = useSearchParams();
	const [data, setData] = useState({});
	const [token, setToken] = useState("");
	const [dataCheck, setDataCheck] = useState(false);
	const [tokenCheck, setTokenCheck] = useState(false);
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
				setData(jwt_decode(actualData.token));
				setToken(actualData.token);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, []);

	useEffect(() => {
		if (data.user) {
			ReactSession.set("login", data.user.login);
			ReactSession.set("firstname", data.user.firstname);
			ReactSession.set("lastname", data.user.lastname);
			ReactSession.set("image_url", data.user.image_url);
			ReactSession.set("clearance", data.user.clearance);
			setDataCheck(true);
		}
	}, [data]);

	useEffect(() => {
		ReactSession.set("token", token);
		setTokenCheck(true);
	}, [token]);

	useEffect(() => {
		if (dataCheck && tokenCheck)
			setRet(<Navigate to={-1} replace={true} />);
		// setRet(<></>);
	}, [dataCheck, tokenCheck]);

	return ret;
};

export default Login;
