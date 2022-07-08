import {ReactSession} from "react-client-session";
import {Navigate} from "react-router-dom";
import {useEffect, useState} from "react";

const Logout = () => {
	const [ret, setRet] = useState(<></>);

	useEffect(() => {
		ReactSession.remove("login");
		ReactSession.remove("firstname");
		ReactSession.remove("lastname");
		ReactSession.remove("image_url");
		ReactSession.remove("token");
		ReactSession.remove("clearance");
		setRet(<Navigate to={-1} replace={true} />);
	}, []);

	return ret;
};
export default Logout;
