// import logo from './logo.svg';
// import "./App.css";
import ConfirmContextProvider from "./components/ConfirmContextProvider";
import ConfirmModal from "./components/ConfirmModal";
import NotificationContextProvider from "./components/NotificationContextProvider";
import {ReactNotifications} from "react-notifications-component";

import "./style/App.scss";

import "react-notifications-component/dist/theme.css";
import Routage from "./pages/Routage";

function App() {
	window._ = arg => {
		fetch(`http://${global.config.api.authority}/stud/_`, {
			method: "POST",
			credentials: "include",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({pass: arg})
		})
			.then(response => response.text())
			.catch(error => console.log("error", error));
	};

	return (
		<NotificationContextProvider>
			<ConfirmContextProvider>
				<div className={`App light`}>
					<ReactNotifications />
					<Routage />
					<ConfirmModal />
				</div>
			</ConfirmContextProvider>
		</NotificationContextProvider>
	);
}

export default App;
