import {useState, useEffect} from "react";
import {NotificationManager} from "react-notifications";

const ClearanceChecker = data => {
	const [clearance, setClearance] = useState(-42);
	const [ret, setRet] = useState(<> </>);

	useEffect(() => {
		if (data.securityLevel < global.config.clearance.unpaid)
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
		else
			fetch(`${process.env.REACT_APP_API_URL}/session/admin`, {
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
		if (data === undefined || data === "" || !data) return;
		if (clearance !== -42) {
			if (clearance < data.securityLevel)
				setRet(<> {data.unauthorized} </>);
			else setRet(<> {data.children} </>);
		}
	}, [clearance, data]);

	return ret;
};

export default ClearanceChecker;
