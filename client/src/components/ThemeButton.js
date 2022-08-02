const ThemeButton = () => {
	const toggleTheme = () => {
		fetch(`http://${global.config.api.authority}/theme`, {
			credentials: "include",
			method: "PATCH"
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	};

	return <button onClick={toggleTheme}>☀️🌙</button>;
};

export default ThemeButton;
