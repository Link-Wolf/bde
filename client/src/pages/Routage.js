import React from "react";
import {Navigate, Routes, Route, BrowserRouter} from "react-router-dom";

import ClearanceChecker from "../components/ClearanceChecker";

import {NotificationContainer} from "react-notifications";

// Nos pagis
import Home from "./body/Home";
import Cgu from "./body/Cgu";
import Cgv from "./body/Cgv";
import Shop from "./body/Shop";
import Events from "./body/Events";
import Event from "./body/Event";
import NoPage from "./body/NoPage";
import Contact from "./body/Contact";
import Product from "./body/Product";
import AdminEventsGestion from "./body/AdminEventsGestion";
import AdminEventsSubscribtions from "./body/AdminEventsSubscribtions";
import AdminContributions from "./body/AdminContributions";
import AdminLogs from "./body/AdminLogs";
import AdminCaptainManagement from "./body/AdminCaptainManagement";
import AdminStudents from "./body/AdminStudents";
import Log from "./body/Log";
import Me from "./body/Me";
import Clubs from "./body/Clubs";
import Profile from "./body/Profile";
import AdminShopGestion from "./body/AdminShopGestion";
import Contribute from "./body/Contribute";
import Receipt from "./body/Receipt";
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
				<Route path="log" element={<Log />} />
				<Route
					path="log/redirect"
					element={<RouteWrapper route={<Log />} />}
				/>
				<Route
					path="shop"
					element={<RouteWrapper route={<Shop />} />}
				/>
				<Route
					path="product/:id"
					element={
						<RouteWrapper
							route={<Product />}
							check={global.config.clearance.pool}
						/>
					}
				/>
				<Route
					path="clubs"
					element={
						<RouteWrapper
							route={<Clubs />}
							check={global.config.clearance.other_campus}
						/>
					}
				/>
				<Route
					path="me"
					element={
						<RouteWrapper
							route={<Me />}
							check={global.config.clearance.other_campus}
						/>
					}
				/>
				<Route
					path="profile/:login"
					element={
						<RouteWrapper
							route={<Profile />}
							check={global.config.clearance.unpaid}
						/>
					}
				/>
				<Route
					path="receipt/:id"
					element={
						<RouteWrapper
							route={<Receipt />}
							check={global.config.clearance.stud}
						/>
					}
				/>
				<Route
					path="events"
					element={
						<RouteWrapper
							route={<Events />}
							check={global.config.clearance.pool}
						/>
					}
				/>
				<Route
					path="contribute"
					element={
						<RouteWrapper
							route={<Contribute />}
							check={global.config.clearance.stud}
						/>
					}
				/>
				<Route
					path="event/:id"
					element={
						<RouteWrapper
							route={<Event />}
							check={global.config.clearance.pool}
						/>
					}
				/>
				<Route
					path="admin/teammanagement"
					element={
						<RouteWrapper
							route={<AdminCaptainManagement />}
							check={global.config.clearance.bde_director}
						/>
					}
				/>
				<Route
					path="admin/shop"
					element={
						<RouteWrapper
							route={<AdminShopGestion />}
							check={global.config.clearance.admin}
						/>
					}
				/>
				<Route
					path="admin/events/gestion"
					element={
						<RouteWrapper
							route={<AdminEventsGestion />}
							check={global.config.clearance.admin}
						/>
					}
				/>
				<Route
					path="admin/events/subscribtions"
					element={
						<RouteWrapper
							route={<AdminEventsSubscribtions />}
							check={global.config.clearance.admin}
						/>
					}
				/>
				<Route
					path="admin/contributions"
					element={
						<RouteWrapper
							route={<AdminContributions />}
							check={global.config.clearance.admin}
						/>
					}
				/>
				<Route
					path="admin/logs"
					element={
						<RouteWrapper
							route={<AdminLogs />}
							check={global.config.clearance.admin}
						/>
					}
				/>
				<Route
					path="admin/students"
					element={
						<RouteWrapper
							route={<AdminStudents />}
							check={global.config.clearance.admin}
						/>
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
			<ClearanceChecker
				securityLevel={params.check}
				unauthorized={<NoPage />}
			>
				<Header />
				<NotificationContainer />
				{params.route}
				<Footer />
			</ClearanceChecker>
		</>
	);
};

export default Routage;
