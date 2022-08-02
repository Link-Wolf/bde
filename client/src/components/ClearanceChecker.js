import {useState, useEffect} from "react";

const ClearanceChecker = data => {
	const [clearance, setClearance] = useState(-42);
	const [ret, setRet] = useState(<> </>);

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/session`, {
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
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, []);

	useEffect(() => {
		if (clearance !== -42) {
			if (clearance < data.securityLevel)
				setRet(<> {data.unauthorized} </>);
			else setRet(<> {data.children} </>);
		}
	}, [clearance, data]);

	return ret;
};

export default ClearanceChecker;
