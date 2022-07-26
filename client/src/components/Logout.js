import {Navigate} from "react-router-dom";
import {useEffect, useState} from "react";

const Logout = () => {
	const [ret, setRet] = useState(<> </>);

	useEffect(() => {
		fetch("http://localhost:4242/auth/logout", {credentials: "include"})
			.then(() => {
				setRet(<Navigate to="/" />);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " + error.message
				);
			});
	}, []);

	return ret;
};
export default Logout;
