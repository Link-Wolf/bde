import {useState, useEffect} from "react";
import {PayPalScriptProvider, PayPalButtons} from "@paypal/react-paypal-js";

const Contribute = () => {
	const [options, setOptions] = useState({
		"client-id": global.config.paypal.id,
		currency: "EUR",
		intent: "capture"
	});
	const currency = "EUR";
	const [amount, setAmount] = useState();
	const style = {layout: "vertical"};

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
				let tmp = options;
				tmp["data-client-token"] = text;
				setOptions(tmp);
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
		<PayPalScriptProvider options={options}>
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
							// Your code here after create the order
							return orderId;
						});
				}}
				onApprove={function(data, actions) {
					return actions.order.capture().then(function() {
						// Your code here after capture the order
					});
				}}
			/>
		</PayPalScriptProvider>
	);
};

export default Contribute;
