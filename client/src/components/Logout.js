import {Navigate} from "react-router-dom";
import {useEffect, useState} from "react";

const Logout = () => {
	const [ret, setRet] = useState(<> </>);

	useEffect(() => {
		fetch("http://localhost:4242/auth/logout", {
			method: "POST",
			credentials: "include"
		})
			.then(async () => {
				let loop = true;
				let breakLoop = () => {
					loop = false;
				};
				while (loop) {
					await fetch("http://localhost:4242/session", {
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
							console.log(data);
							if (data.clearance === 0) breakLoop();
						});
					await new Promise(res => setTimeout(res, 200));
				}
			})
			.then(() => {
				setRet(<Navigate to="/home" replace={true} />);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, []);

	return ret;
};
export default Logout;
