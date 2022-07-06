import {useState, useEffect} from "react";
import Login from "../../components/Login";
import Logout from "../../components/Logout";
import {ReactSession} from "react-client-session";

const Log = () => {
	const [ret, setRet] = useState(<></>);
	const [login, setLogin] = useState("42");

	useEffect(() => {
		try {
			setLogin(ReactSession.get("token"));
		} catch {
			setLogin("");
		}
	}, []);
	useEffect(() => {
		if (login === "") setRet(<Login />);
		else if (login !== "42") setRet(<Logout />);
	}, [login]);

	return ret;
};

export default Log;
