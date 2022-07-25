import {useState, useEffect} from "react";
import Login from "../../components/Login";
import Logout from "../../components/Logout";

const Log = () => {
	const [ret, setRet] = useState(<></>);
	const [login, setLogin] = useState("42");

	useEffect(() => {
// TODO: token
	}, []);
	useEffect(() => {
		if (login === undefined) setRet(<Login />);
		else if (login !== "42") setRet(<Logout />);
	}, [login]);

	return ret;
};

export default Log;
