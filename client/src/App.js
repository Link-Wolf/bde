// import logo from './logo.svg';
// import "./App.css";
import {useState, useEffect} from "react";

import "./style/App.css";

import Routage from "./pages/Routage";

function App() {
	const [theme, setTheme] = useState("light");

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/theme`, {
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
			.then(data => {
				if (data.theme !== -42) setTheme(data.theme);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, []);

	return (
		<div className={`App ${theme}`}>
			<Routage />
		</div>
	);
}

export default App;
