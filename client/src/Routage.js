import React from "react";
import {Routes, Route,  BrowserRouter} from "react-router-dom";

// Nos pagis
import Home from "./pages/Home";
import About from "./pages/About";

const Routage = () => {
	return (
		<BrowserRouter>
			<Routes>
				{" "}
				{/* The Switch decides which component to show based on the current URL.*/}
				<Route exact path="/" component={Home}></Route>
				<Route exact path="/about" component={About}></Route>
				<Route path="/" element={<Home />} />
	   			<Route path="about/*" element={<About />} />
			</Routes>
		</BrowserRouter>
	);
};

export default Routage;
