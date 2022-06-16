import React from "react";
import {Routes, Route,  BrowserRouter} from "react-router-dom";

// Nos pagis
import Home from "./pages/Home";
import About from "./pages/About";

const Routage = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
	   			<Route path="about/*" element={<About />} />
			</Routes>
		</BrowserRouter>
	);
};

export default Routage;
