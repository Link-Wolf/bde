import {useState, useEffect} from "react";
import {useParams, Navigate} from "react-router-dom";
import {Print} from "../../components/Invoice";

const Receipt = () => {
	const [type, setType] = useState(undefined);
	const [dataEvent, setDataEvent] = useState(undefined);
	const [session, setSession] = useState({});
	const [loadSession, setLoadSession] = useState(true);
	const [order, setOrder] = useState({});
	const [loadOrder, setLoadOrder] = useState(true);
	const [loadMail, setLoadMail] = useState(false);

	const param = useParams();

	useEffect(() => {
		setLoadSession(true);
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
			.then(json => {
				setSession(json);
				setLoadSession(false);
			});
	}, []);

	useEffect(() => {
		setLoadOrder(true);
		if (session.login === undefined) return;
		fetch(`${process.env.REACT_APP_API_URL}/order/${param.id}`, {
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
				if (json.type !== -1) setType("event");
				else setType("contrib");
				setOrder(json);
			});
	}, [param, session]);

	useEffect(() => {
		setLoadOrder(true);
		if (session.login === undefined || type === "contrib") return;
		fetch(`${process.env.REACT_APP_API_URL}/event/${order.type}`, {
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
				setDataEvent(json);
				setLoadOrder(false);
			});
	}, [order]);

	if (
		loadSession ||
		loadOrder ||
		loadMail ||
		type === undefined ||
		dataEvent === undefined
	)
		return <>Loading</>;
	if (session.login !== order.studLogin) return <Navigate to="/home" />;
	return (
		<>
			Facture :
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
				item={
					type === "event"
						? `Inscription à l'évènement "${dataEvent.name}"`
						: "Contribution"
				}
			/>
		</>
	);
};

export default Receipt;
