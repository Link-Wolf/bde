import {useState, useEffect} from "react";
import {
	PayPalScriptProvider,
	PayPalButtons,
	usePayPalScriptReducer
} from "@paypal/react-paypal-js";

const ContributeButtons = () => {
	const currency = "EUR";
	const [amount, setAmount] = useState();
	const [session, setSession] = useState();
	const style = {layout: "vertical"};
	const [{options, isPending}, dispatch] = usePayPalScriptReducer();

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
						);
						//avertir que OK
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
