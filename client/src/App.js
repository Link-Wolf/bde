// import logo from './logo.svg';
// import "./App.css";
import {useState, useEffect} from "react";

import "./style/App.css";

import Header from "./pages/Header";
import Routage from "./pages/Routage";
import Footer from "./pages/Footer";

function App() {
	const [theme, setTheme] = useState("light");

	useEffect(() => {
		fetch(`http://localhost:4242/theme`, {
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
				if (data.theme != -42) setTheme(data.theme);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, []);

	return (
		<div className="App">
			<Header />
			<div className={theme}>
				<Routage />
			</div>
			<Footer />
		</div>
	);
}

export default App;

// import { Link } from "react-router-dom";
// ...
// <Link to="/signup">
//   <button variant="outlined">
//     Sign up
//   </button>
// </Link>
