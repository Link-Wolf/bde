import {useState, useEffect} from "react";
import {useParams, Navigate} from "react-router-dom";
import {Print} from "../../components/Invoice";

const Receipt = () => {
	const [session, setSession] = useState({});
	const [loadSession, setLoadSession] = useState(true);
	const [order, setOrder] = useState({});
	const [loadOrder, setLoadOrder] = useState(true);

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

	useEffect(() => {
		setLoadOrder(true);
		fetch(`http://${global.config.api.authority}/order/${param.id}`, {
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
				setOrder(json);
				setLoadOrder(false);
			});
	}, [param]);

	if (loadSession || loadOrder) return <>Loading</>;
	if (session.login !== order.studLogin) return <Navigate to="/home" />;
	return (
		<>
			Receipt :
			<Print
				id={order.id}
				date={new Date(order.date).toLocaleDateString()}
				buyer={`${order.stud.lastname.toUpperCase()} ${
					order.stud.firstname
				}`}
				mail={order.stud.mail}
				payement_method={order.source}
				price={order.cost}
				item="Contribution"
			/>
		</>
	);
	//passer en param du print : id / date / buyer ("NOM Prenom") / mail / payement_method / item / price
};

export default Receipt;
