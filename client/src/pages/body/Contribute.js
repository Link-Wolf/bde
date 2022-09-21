import {useState, useEffect} from "react";
import emailjs from "@emailjs/browser";
import {
	PayPalScriptProvider,
	PayPalButtons,
	usePayPalScriptReducer
} from "@paypal/react-paypal-js";

const ContributeButtons = () => {
	const currency = "EUR";
	const [amount, setAmount] = useState();
	const [session, setSession] = useState({});
	const style = {layout: "vertical"};
	const [{options, isPending}, dispatch] = usePayPalScriptReducer();
	const [contributionStatus, setContributionStatus] = useState(false);

	const sendMail = async (date, commande, timestamp, mail) => {
		await emailjs
			.send(
				global.config.emailjs.service_id,
				global.config.emailjs.template_paiement,
				{
					date: date,
					commande: commande,
					timestamp: timestamp,
					mail: mail
				},
				global.config.emailjs.public_key
			)
			.then(
				result => {
					console.log(result.text);
				},
				error => {
					console.log(error.text);
				}
			)
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération mail: " +
						error.message
				);
			});
	};

	useEffect(() => {
		dispatch({
			type: "resetOptions",
			value: {
				...options,
				currency: currency
			}
		});
	}, [currency]);

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
			.then(json => {
				setSession(json);
			});
	}, []);

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/contribution/price`, {
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
				setAmount(json.price);
			});
	}, []);

	useEffect(() => {
		if (options.login !== "")
			fetch(
				`http://${global.config.api.authority}/contribution/${session.login}`,
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
					return response.json();
				})
				.then(data => {
					data.forEach((item, i) => {
						if (
							new Date(item.end_date) > Date.now() &&
							new Date(item.begin_date) <= Date.now()
						) {
							setContributionStatus(true);
						}
					});
				})
				.catch(function(error) {
					console.log(
						"Il y a eu un problème avec l'opération fetch: " +
							error.message
					);
				});
	}, [session]);

	if (contributionStatus) {
		window.location = "/home";
		return <></>;
	}
	return (
		<>
			{isPending && <div className="spinner" />}
			<PayPalButtons
				style={style}
				disabled={false}
				forceReRender={[amount, currency, style]}
				fundingSource={undefined}
				createOrder={(data, actions) => {
					return actions.order
						.create({
							purchase_units: [
								{
									amount: {
										currency_code: currency,
										value: amount
									}
								}
							]
						})
						.then(orderId => {
							const body = JSON.stringify({
								id: orderId,
								studLogin: session.login,
								cost: amount,
								source: data.paymentSource
							});
							fetch(
								`http://${global.config.api.authority}/order/create`,
								{
									method: "POST",
									credentials: "include",
									body: body,
									headers: {
										"Content-Type": "application/json"
									}
								}
							);
							return orderId;
						});
				}}
				onApprove={function(data, actions) {
					return actions.order.capture().then(function() {
						const body = JSON.stringify({
							id: data.orderID
						});
						fetch(
							`http://${global.config.api.authority}/order/capture`,
							{
								method: "POST",
								credentials: "include",
								body: body,
								headers: {
									"Content-Type": "application/json"
								}
							}
						)
							.then(response => {
								if (!response.ok) {
									throw new Error(
										`This is an HTTP error: The status is ${response.status}`
									);
								}
								return response.json();
							})
							.then(async data => {
								console.log("Here : ", data.order, data.mail);
								await sendMail(
									new Date(Date.now()).toLocaleDateString(
										"fr-FR",
										{
											weekday: "long",
											year: "numeric",
											month: "long",
											day: "numeric"
										}
									),
									data.order.id,
									new Intl.DateTimeFormat("fr-FR", {
										day: "numeric",
										month: "short",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
										second: "2-digit",
										timeZoneName: "short"
									}).format(new Date(data.order.date)),
									data.mail
								);
							})
							.then(() => {
								window.location = `/receipt/${data.orderID}`;
							});
					});
				}}
				onShippingChange={function(data, actions) {
					return actions.resolve();
				}}
			/>
		</>
	);
};

const Contribute = () => {
	const [optionsProvider, setOptionsProvider] = useState({
		"client-id": global.config.paypal.id,
		currency: "EUR",
		intent: "capture"
	});

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/paypal/clientToken`, {
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.text();
			})
			.then(text => {
				let tmp = optionsProvider;
				tmp["data-client-token"] = text;
				setOptionsProvider(tmp);
			});
	}, []);

	return (
		<PayPalScriptProvider options={optionsProvider}>
			<ContributeButtons />
		</PayPalScriptProvider>
	);
};

export default Contribute;
