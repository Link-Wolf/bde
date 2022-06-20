import React from "react";
import {Routes, Route, BrowserRouter} from "react-router-dom";

// Nos pagis
import Home from "./pages/Home";
import About from "./pages/About";
import Cgu from "./pages/Cgu";
import Stud from "./pages/Stud";
import Event from "./pages/Event";

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
