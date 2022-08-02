import React from "react";
import {Navigate, Routes, Route, BrowserRouter} from "react-router-dom";

import ClearanceChecker from "../components/ClearanceChecker";

// Nos pagis
import Home from "./body/Home";
import About from "./body/About";
import Cgu from "./body/Cgu";
import Cgv from "./body/Cgv";
import Shop from "./body/Shop";
import Events from "./body/Events";
import Event from "./body/Event";
import NoPage from "./body/NoPage";
import Contact from "./body/Contact";
import AdminEventsGestion from "./body/AdminEventsGestion";
import AdminEventsSubscribtions from "./body/AdminEventsSubscribtions";
import AdminContributions from "./body/AdminContributions";
import AdminLogs from "./body/AdminLogs";
import AdminCaptainManagement from "./body/AdminCaptainManagement";
import AdminStudents from "./body/AdminStudents";
import Log from "./body/Log";
import Me from "./body/Me";
import Profile from "./body/Profile";

import Header from "./Header";
import Footer from "./Footer";

const Routage = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="" element={<Navigate to="/home" />} />
				<Route
					path="home"
					element={<RouteWrapper route={<Home />} />}
				/>
				<Route
					path="about"
					element={<RouteWrapper route={<About />} />}
				/>
				<Route
					path="dollarthings"
					element={<RouteWrapper route={<Cgv />} />}
				/>
				<Route
					path="legalthings"
					element={<RouteWrapper route={<Cgu />} />}
				/>
				<Route
					path="contact"
					element={<RouteWrapper route={<Contact />} />}
				/>
				<Route path="log" element={<RouteWrapper route={<Log />} />} />
				<Route
					path="log/redirect"
					element={<RouteWrapper route={<Log />} />}
				/>
				<Route
					path="shop"
					element={<RouteWrapper route={<Shop />} />}
				/>
				<Route
					path="me"
					element={
						<ClearanceChecker
							securityLevel={global.config.clearance.other_campus}
							unauthorized={<Navigate to="/home"></Navigate>}
						>
							<RouteWrapper route={<Me />} />
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
							<RouteWrapper route={<Profile />} />
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
							<RouteWrapper route={<Events />} />
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
							<RouteWrapper route={<Event />} />
						</ClearanceChecker>
					}
				/>
				<Route
					path="admin/teammanagement"
					element={
						<ClearanceChecker
							securityLevel={global.config.clearance.bde_director}
							unauthorized={<Navigate to="/home"></Navigate>}
						>
							<RouteWrapper route={<AdminCaptainManagement />} />
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
							<RouteWrapper route={<AdminEventsGestion />} />
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
							<RouteWrapper
								route={<AdminEventsSubscribtions />}
							/>
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
							<RouteWrapper route={<AdminContributions />} />
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
							<RouteWrapper route={<AdminLogs />} />
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
							<RouteWrapper route={<AdminStudents />} />
						</ClearanceChecker>
					}
				/>
				<Route
					path="admin/*"
					element={<Navigate to="/admin/students" />}
				/>

				<Route path="*" element={<NoPage />} />
			</Routes>
		</BrowserRouter>
	);
};
const RouteWrapper = params => {
	return (
		<>
			<Header />
			{params.route}
			<Footer />
		</>
	);
};

const AdminRoutes = () => {
	return (
		<>
			<Routes></Routes>
		</>
	);
};

export default Routage;
