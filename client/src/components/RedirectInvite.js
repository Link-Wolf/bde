import {useState, useEffect} from "react";
import {Navigate} from "react-router-dom";
import {ReactSession} from "react-client-session";

const RedirectInvite = data => {
	const [token, setToken] = useState("42");
	const [ret, setRet] = useState(<></>);

	useEffect(() => {
		try {
			setToken(ReactSession.get("token"));
		} catch {
			setToken("");
		}
	}, []);

	useEffect(() => {
		if (token !== "42") {
			if (token === "") setRet(<Navigate to="/home" />);
			else setRet(<>{data.children}</>);
		}
	}, [token]);

	return ret;
};

export default RedirectInvite;
