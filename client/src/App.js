// import logo from './logo.svg';
// import './App.css';

import Header from "./Header";
import Routage from "./Routage";
import Footer from "./Footer";

function App() {
	return (
		<div className="App">
			<header>
				<Header />
			</header>
			<Routage />
			<footer>
				<Footer />
			</footer>
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
