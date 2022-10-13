import {useState, useEffect} from "react";
import {useParams, Navigate} from "react-router-dom";
import {Print} from "../../components/Invoice";

const Receipt = () => {
	const [session, setSession] = useState({});
	const [loadSession, setLoadSession] = useState(true);
	const [order, setOrder] = useState({});
	const [loadOrder, setLoadOrder] = useState(true);
	const [loadMail, setLoadMail] = useState(true);

	const param = useParams();

	useEffect(() => {
		setLoadMail(true);
		if (session.login == undefined) return;
		fetch(
			`http://${global.config.api.authority}/stud/${session.login}/mail`,
			{
				credentials: "include"
			}
		)
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.text();
			})
			.then(data => {
				let tmp = order;
				if (!data || data == "" || data == undefined) {
					tmp.stud.true_email = "";
				} else {
					tmp.stud.true_email = data;
				}
				setOrder(tmp);
				setLoadMail(false);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, [session, order]);

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
		if (session.login == undefined) return;
		fetch(`http://${global.config.api.authority}/order/${param.id}`, {
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) {
					window.location = "/home";
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(json => {
				if (json.stud.login !== session.login && !loadSession)
					window.location = "/home";
				setOrder(json);
				setLoadOrder(false);
			});
	}, [param, session]);

	if (loadSession || loadOrder || loadMail) return <>Loading</>;
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
				mail={order.stud.true_email}
				payement_method={order.source}
				address={order.address}
				city={order.city}
				price={order.cost}
				item="Contribution"
			/>
		</>
	);
};

export default Receipt;
