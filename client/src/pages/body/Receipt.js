import {useState, useEffect} from "react";
import {useParams, Navigate} from "react-router-dom";

const Receipt = () => {
	const [session, setSession] = useState();
	const [loadSession, setLoadSession] = useState();
	const [order, setOrder] = useState();
	const [loadOrder, setLoadOrder] = useState();

	const param = useParams();

	useEffect(() => {
		setLoadSession(true);
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
			.then(json => {
				setSession(json);
				setLoadSession(false);
			});
	}, []);

	console.log(param);

	if (loadSession || loadOrder) return <>Loading</>;
	if (session.login !== order.studLogin) return <Navigate to="/home" />;
	return <>Receipt</>;
};

export default Receipt;
