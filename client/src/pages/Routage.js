import { Navigate, Routes, Route, BrowserRouter } from "react-router-dom";

import ClearanceChecker from "../components/ClearanceChecker";

import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";

import style from "../style/Routage.module.scss";

// Nos pages
import Home from "./body/Home";
import Cgu from "./body/Cgu";
import Cgv from "./body/Cgv";
import NoPage from "./body/NoPage";
import Contact from "./body/Contact";
import AdminEventsGestion from "./body/AdminEventsGestion";
import AdminEventsSubscribtions from "./body/AdminEventsSubscribtions";
// import AdminContributions from "./body/AdminContributions";
import AdminLogs from "./body/AdminLogs";
import AdminCaptainManagement from "./body/AdminCaptainManagement";
import AdminStudents from "./body/AdminStudents";
// import AdminClubs from "./body/AdminClubs";
import Log from "./body/Log";
import Me from "./body/Me";
// import Clubs from "./body/Clubs";
import Profile from "./body/Profile";
import AdminShopGestion from "./body/AdminShopGestion";
// import {Purchase, PrePurchase} from "./body/Purchase";
import PingPong from "./body/PingPong";
import Receipt from "./body/Receipt";
import Header from "./Header";
import Footer from "./Footer";
import AdminUnpaidManagement from "./body/AdminUnpaidManagement";

const Redirect = () => {
    window.location.replace("/home");
    return <></>;
};

const Routage = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="" element={<Redirect />} />
                <Route
                    path="home"
                    element={<RouteWrapper route={<Home />} />}
                />
                <Route
                    path="pingpong"
                    element={<RouteWrapper route={<PingPong />} />}
                />
                <Route
                    path="legalthings"
                    element={<RouteWrapper route={<Cgu />} />}
                />
                <Route
                    path="dollarthings"
                    element={<RouteWrapper route={<Cgv />} />}
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
                {
                    // <Route
                    // 	path="clubs"
                    // 	element={
                    // 		<RouteWrapper
                    // 			route={<Clubs />}
                    // 			check={global.config.clearance.other_campus}
                    // 		/>
                    // 	}
                    // />
                }
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
                            check={global.config.clearance.other_campus}
                        />
                    }
                />
                {
                    // <Route
                    // 	path="purchase/contrib"
                    // 	element={
                    // 		<RouteWrapper
                    // 			route={<Purchase />}
                    // 			check={global.config.clearance.stud}
                    // 		/>
                    // 	}
                    // />
                    // <Route
                    // 	path="purchase/:event"
                    // 	element={
                    // 		<RouteWrapper
                    // 			route={<PrePurchase />}
                    // 			check={global.config.clearance.pool}
                    // 		/>
                    // 	}
                    // />
                }
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
                    path="admin/volunteersmanagement"
                    element={
                        <RouteWrapper
                            route={<AdminUnpaidManagement />}
                            check={global.config.clearance.admin}
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
                {
                    // <Route
                    // 	path="admin/clubs"
                    // 	element={
                    // 		<RouteWrapper
                    // 			route={<AdminClubs />}
                    // 			check={global.config.clearance.admin}
                    // 		/>
                    // 	}
                    // />
                }
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
                {
                    // <Route
                    // 	path="admin/contributions"
                    // 	element={
                    // 		<RouteWrapper
                    // 			route={<AdminContributions />}
                    // 			check={global.config.clearance.admin}
                    // 		/>
                    // 	}
                    // />
                }
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
                    element={<Navigate to="/admin/students" replace />}
                />

                <Route path="*" element={<NoPage />} />
            </Routes>
        </BrowserRouter>
    );
};

const RouteWrapper = (params) => {
    return (
        <>
            <ClearanceChecker
                securityLevel={params.check}
                unauthorized={<NoPage />}
            >
                <Header />
                <NotificationContainer />
                <div>
                    <div className={style.bodyContainer}>{params.route}</div>
                    <Footer />
                </div>
            </ClearanceChecker>
        </>
    );
};

export default Routage;
