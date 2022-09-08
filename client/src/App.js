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
	const [theme] = useState("light");

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
