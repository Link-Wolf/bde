import {useState, useEffect} from "react";
import Login from "../../components/Login";
import Logout from "../../components/Logout";
import {NotificationManager} from "react-notifications";

const Log = () => {
	const [ret, setRet] = useState(<></>);
	const [clearance, setClearance] = useState(-42);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/session`, {
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
				if (data.clearance !== -42) setClearance(data.clearance);
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, []);

	useEffect(() => {
		if (clearance === 0) setRet(<Login />);
		else if (clearance !== -42) setRet(<Logout />);
	}, [clearance]);

	return ret;
};

export default Log;
