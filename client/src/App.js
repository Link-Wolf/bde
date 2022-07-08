import {ReactSession} from "react-client-session";

// import logo from './logo.svg';
// import "./App.css";

import "./style/App.css";

import Header from "./pages/Header";
import Routage from "./pages/Routage";
import Footer from "./pages/Footer";

function App() {
	ReactSession.setStoreType("localStorage");

	return (
		<div className="App">
			<Header />
			<Routage />
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
