import {ReactSession} from "react-client-session";
import {Navigate} from "react-router-dom";
import {useEffect} from "react";

const Logout = () => {
	useEffect(() => {
		ReactSession.set("login", "");
		ReactSession.set("firstname", "");
		ReactSession.set("lastname", "");
		ReactSession.set("image_url", "");
		ReactSession.set("token", "");
	}, []);

	// return <Navigate to="/home" />;
};
export default Logout;
