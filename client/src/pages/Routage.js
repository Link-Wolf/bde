import React from "react";
import {Navigate, Routes, Route, BrowserRouter} from "react-router-dom";

import ClearanceChecker from "../components/ClearanceChecker";

// Nos pagis
import Home from "./body/Home";
import About from "./body/About";
import Cgu from "./body/Cgu";
import Cgv from "./body/Cgv";
import Stud from "./body/Studs";
import Shop from "./body/Shop";
import Events from "./body/Events";
import Event from "./body/Event";
import NoPage from "./body/NoPage";
import Contact from "./body/Contact";
import AdminEventsGestion from "./body/AdminEventsGestion";
import AdminEventsSubscribtions from "./body/AdminEventsSubscribtions";
import AdminContributions from "./body/AdminContributions";
import AdminLogs from "./body/AdminLogs";
import AdminStudents from "./body/AdminStudents";
import Log from "./body/Log";
import Me from "./body/Me";
import Profile from "./body/Profile";

const Routage = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="" element={<Navigate to="/home" />} />
				<Route path="home" element={<Home />} />
				<Route path="about" element={<About />} />
				<Route path="cgu" element={<Cgu />} />
				<Route path="dollarthings" element={<Cgv />} />
				<Route path="legalthings" element={<Cgu />} />
				<Route path="contact" element={<Contact />} />
				<Route path="log" element={<Log />} />
				<Route path="log/redirect" element={<Log />} />
				<Route path="shop" element={<Shop />} />

				<Route
					path="me"
					element={
						<ClearanceChecker
							securityLevel={global.config.clearance.other_campus}
							unauthorized={<Navigate to="/home"></Navigate>}
						>
							<Me />
						</ClearanceChecker>
					}
				/>

				<Route
					path="profile/:login"
					element={
						<ClearanceChecker
							securityLevel={global.config.clearance.unpaid}
							unauthorized={<Navigate to="/home"></Navigate>}
						>
							<Profile />
						</ClearanceChecker>
					}
				/>

				<Route
					path="events"
					element={
						<ClearanceChecker
							securityLevel={global.config.clearance.pool}
							unauthorized={<Navigate to="/home"></Navigate>}
						>
							<Events />
						</ClearanceChecker>
					}
				/>

				<Route
					path="event/:id"
					element={
						<ClearanceChecker
							securityLevel={global.config.clearance.pool}
							unauthorized={<Navigate to="/home"></Navigate>}
						>
							<Event />
						</ClearanceChecker>
					}
				/>
				<Route
					path="admin/events/gestion"
					element={
						<ClearanceChecker
							securityLevel={global.config.clearance.admin}
							unauthorized={<Navigate to="/home"></Navigate>}
						>
							<AdminEventsGestion />
						</ClearanceChecker>
					}
				/>
				<Route
					path="admin/events/subscribtions"
					element={
						<ClearanceChecker
							securityLevel={global.config.clearance.admin}
							unauthorized={<Navigate to="/home"></Navigate>}
						>
							<AdminEventsSubscribtions />
						</ClearanceChecker>
					}
				/>
				<Route
					path="admin/contributions"
					element={
						<ClearanceChecker
							securityLevel={global.config.clearance.admin}
							unauthorized={<Navigate to="/home"></Navigate>}
						>
							<AdminContributions />
						</ClearanceChecker>
					}
				/>
				<Route
					path="admin/logs"
					element={
						<ClearanceChecker
							securityLevel={global.config.clearance.admin}
							unauthorized={<Navigate to="/home"></Navigate>}
						>
							<AdminLogs />
						</ClearanceChecker>
					}
				/>
				<Route
					path="admin/students"
					element={
						<ClearanceChecker
							securityLevel={global.config.clearance.admin}
							unauthorized={<Navigate to="/home"></Navigate>}
						>
							<AdminStudents />
						</ClearanceChecker>
					}
				/>

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
