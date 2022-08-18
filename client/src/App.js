// import logo from './logo.svg';
// import "./App.css";
import {useState, useEffect} from "react";
import ConfirmContextProvider from "./components/ConfirmContextProvider";
import ConfirmModal from "./components/ConfirmModal";
import NotificationContextProvider from "./components/NotificationContextProvider";
import {ReactNotifications} from "react-notifications-component";

import "./style/App.css";

import "react-notifications-component/dist/theme.css";
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
		<NotificationContextProvider>
			<ConfirmContextProvider>
				<div className={`App ${theme}`}>
					<ReactNotifications />
					<Routage />
					<ConfirmModal />
				</div>
			</ConfirmContextProvider>
		</NotificationContextProvider>
	);
}

export default App;
