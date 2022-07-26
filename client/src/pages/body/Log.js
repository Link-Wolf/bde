import {useState, useEffect} from "react";
import Login from "../../components/Login";
import Logout from "../../components/Logout";

const Log = () => {
	const [ret, setRet] = useState(<></>);
	const [clearance, setClearance] = useState(-42);

	useEffect(() => {
		fetch(`http://localhost:4242/session`, {
			credentials: "include"
		})
		.then(response => {
			if (!response.ok) {
				throw new Error(
					`This is an HTTP error: The status is ${response.status}`
				);
			}
			return response.json();
		})
		.then(data => {
			if (data.clearance != -42)
				setClearance(data.clearance);
		})
		.catch(function(error) {
			console.log(
				"Il y a eu un problème avec l'opération fetch: " +
					error.message
			);
		});
	}, []);

	useEffect(() => {
		if (clearance == 0) setRet(<Login />);
		else if (clearance != -42) setRet(<Logout />);
	}, [clearance]);

	return ret;
};

export default Log;
