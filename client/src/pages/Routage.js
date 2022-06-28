import React from "react";
import {Navigate, Routes, Route, BrowserRouter} from "react-router-dom";

// Nos pagis
import Home from "./body/Home";
import About from "./body/About";
import Cgu from "./body/Cgu";
import Stud from "./body/Studs";
import Events from "./body/Events";
import Event from "./body/Event";
import NoPage from "./body/NoPage";
import Contact from "./body/Contact";
import AdminEventsGestion from "./body/AdminEventsGestion";
import AdminEventsSubscribtions from "./body/AdminEventsSubscribtions";
import AdminContributions from "./body/AdminContributions";
import AdminLogs from "./body/AdminLogs";
import AdminStudents from "./body/AdminStudents";

const Routage = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="" element={<Navigate to="/home" />} />
				<Route path="home" element={<Home />} />
				<Route path="about" element={<About />} />
				<Route path="cgu" element={<Cgu />} />
				<Route path="stud" element={<Stud />} />
				<Route path="events" element={<Events />} />
				<Route path="event/:id" element={<Event />} />
				<Route path="contact" element={<Contact />} />
				<Route
					path="admin/events/gestion"
					element={<AdminEventsGestion />}
				/>
				<Route
					path="admin/events/subscribtions"
					element={<AdminEventsSubscribtions />}
				/>
				<Route
					path="admin/contributions"
					element={<AdminContributions />}
				/>
				<Route path="admin/logs" element={<AdminLogs />} />
				<Route path="admin/students" element={<AdminStudents />} />
				<Route
					path="admin/"
					element={<Navigate to="/admin/students" />}
				/>
				<Route path="*" element={<NoPage />} />
			</Routes>
		</BrowserRouter>
	);
};

export default Routage;
