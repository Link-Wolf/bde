import {useState, useEffect} from "react";
import {useParams, Navigate} from "react-router-dom";
import {Print} from "../../components/Invoice";
import emailjs from "@emailjs/browser";

const Receipt = () => {
	const [type, setType] = useState(undefined);
	const [dataEvent, setDataEvent] = useState(undefined);
	const [session, setSession] = useState({});
	const [loadSession, setLoadSession] = useState(true);
	const [order, setOrder] = useState({});
	const [loadOrder, setLoadOrder] = useState(true);
	const [loadMail, setLoadMail] = useState(false);

	const param = useParams();

	const sendMail = async (date, commande, timestamp, mail) => {
		await emailjs
			.send(
				process.env.REACT_APP_EMAILJS_SERVICE,
				process.env.REACT_APP_EMAILJS_TEMPLATE_PAYMENT,
				{
					date: date,
					commande: commande,
					timestamp: timestamp,
					mail: mail
				},
				process.env.REACT_APP_EMAILJS_PUBLICKEY
			)
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération mail: " +
						error.message
				);
			});
	};

	const compMail = async (data, mail) => {
		if (data.date === undefined) return;
		await sendMail(
			new Intl.DateTimeFormat("fr-FR", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric"
			}).format(new Date(Date.now())),
			data.id,
			new Intl.DateTimeFormat("fr-FR", {
				day: "numeric",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				timeZoneName: "short"
			}).format(new Date(data.date)),
			mail
		);
	};

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
			})
			.catch(err => {
				console.log("error while fetching:", err);
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
			})
			.catch(err => {
				console.log("error while fetching:", err);
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
			})
			.catch(err => {
				console.log("error while fetching:", err);
			});
	}, [order]);

	useEffect(() => {
		if (session === undefined || order === undefined || order.isMailed)
			return;
		fetch(`${process.env.REACT_APP_API_URL}/stud/${session.login}`, {
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
			.then(async stud => {
				await compMail(order, stud.true_email);
				await fetch(
					`${process.env.REACT_APP_API_URL}/order/${param.id}`,
					{
						credentials: "include",
						method: "PATCH",
						body: JSON.stringify({isMailed: true}),
						headers: {"Content-Type": "application/json"}
					}
				);
			})
			.catch(err => {
				console.log("error while fetching:", err);
			});
	}, [session, order]);

	if (
		loadSession ||
		loadOrder ||
		loadMail ||
		type === undefined ||
		dataEvent === undefined
	)
		return <>Loading</>;
	if (session.login !== order.studLogin || !order.isCompleted)
		return <Navigate to="/home" />;
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
