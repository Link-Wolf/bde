import {Navigate} from "react-router-dom";
import {NotificationManager} from "react-notifications";
import {useEffect, useState} from "react";

/**
 * @brief Handles the logout of the user by sending a request to the server and redirecting the user to the home page
 */
const Logout = () => {
	const [ret, setRet] = useState(<> </>);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
			method: "POST",
			credentials: "include"
		})
			.then(async () => {
				let loop = true;
				let breakLoop = () => {
					loop = false;
				};
				while (loop) {
					await fetch(`${process.env.REACT_APP_API_URL}/session`, {
						credentials: "include"
					})
						.then(response => {
							if (!response.ok) {
								throw new Error(
									`This is an HTTP error: The status is ` +
										`${response.status}`
								);
							}
							return response.json();
						})
						.then(data => {
							if (data.clearance === 0) breakLoop();
						});
					await new Promise(res => setTimeout(res, 200));
				}
			})
			.then(() => {
				setRet(<Navigate to="/home" replace={true} />);
			})
			.catch(function(error) {
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, []);

	return ret;
};
export default Logout;
