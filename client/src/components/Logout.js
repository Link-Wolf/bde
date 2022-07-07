import {ReactSession} from "react-client-session";
import {Navigate} from "react-router-dom";
import {useEffect, useState} from "react";

const Logout = () => {
	const [ret, setRet] = useState(<></>);

	useEffect(() => {
		ReactSession.set("login", "");
		ReactSession.set("firstname", "");
		ReactSession.set("lastname", "");
		ReactSession.set("image_url", "");
		ReactSession.set("token", "");
		ReactSession.set("accreditation", "");
		setRet(<Navigate to={-1} replace={true} />);
	}, []);

	return ret;
};
export default Logout;
