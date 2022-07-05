import {useState} from "react";

// import logo from './logo.svg';
// import "./App.css";

import "./style/App.css";

import Header from "./pages/Header";
import Routage from "./pages/Routage";
import Footer from "./pages/Footer";
import UserContext from "./contexts/user.context";

function App() {
	const [token, setToken] = useState("");
	const [user, setUser] = useState({});

	return (
		<div className="App">
			<UserContext.Provider
				value={{
					user: user,
					setUser: setUser,
					token: token,
					setToken: setToken
				}}
			>
				<Header />
				<Routage />
				<Footer />
			</UserContext.Provider>
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
