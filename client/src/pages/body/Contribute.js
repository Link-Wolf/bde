const Contribute = () => {
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
		.then(text => console.log(text));
};

export default Contribute;
