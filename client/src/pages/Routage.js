import React from "react";
import {Routes, Route, BrowserRouter} from "react-router-dom";

// Nos pagis
import Home from "./body/Home";
import About from "./body/About";
import Cgu from "./body/Cgu";
import Stud from "./body/Stud";
import Event from "./body/Event";

const Routage = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="" element={<Redirect to="/home" />} />
				<Route path="home" element={<Home />} />
				<Route path="about" element={<About />} />
				<Route path="cgu" element={<Cgu />} />
				<Route path="stud" element={<Stud />} />
				<Route path="event" element={<Event />} />
			</Routes>
		</BrowserRouter>
	);
};

export default Routage;
