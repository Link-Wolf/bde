import {ReactSession} from "react-client-session";
import {Navigate} from "react-router-dom";
import {useEffect, useState} from "react";

const Logout = () => {
	const [ret, setRet] = useState(<></>);

	useEffect(() => {
		fetch("localhost:4242/auth/logout").then(() => {
			setRet(<Navigate to="/" />);
		});
	}, []);

	return ret;
};
export default Logout;
