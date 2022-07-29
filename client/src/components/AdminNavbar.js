// import {Navbar, Nav, NavDropdown} from "react-bootstrap";
//
// const AdminNavbar = () => {
// 	return (
// 		<Navbar collapseOnSelect bg="secondary" variant="dark">
// 			<Nav className="me-auto">
// 				<Nav.Link href="/admin/students">Students</Nav.Link>
// 				<NavDropdown title="Events">
// 					<NavDropdown.Item href="/admin/events/gestion">
// 						Gestion
// 					</NavDropdown.Item>
// 					<NavDropdown.Item href="/admin/events/subscribtions">
// 						Inscriptions
// 					</NavDropdown.Item>
// 				</NavDropdown>
// 				<Nav.Link href="/admin/contributions">Contributions</Nav.Link>
// 				<Nav.Link href="/admin/logs">Logs</Nav.Link>
// 			</Nav>
// 		</Navbar>
// 	);
// };
//
// export default AdminNavbar;

import React from "react";
import {
	CDBSidebar,
	CDBSidebarContent,
	CDBSidebarFooter,
	CDBSidebarHeader,
	CDBSidebarMenu,
	CDBSidebarMenuItem
} from "cdbreact";
import {NavLink} from "react-router-dom";

const AdminNavbar = () => {
	return (
		<div
			style={{
				display: "flex",
				height: "100vh",
				overflow: "scroll initial"
			}}
		>
			<CDBSidebar textColor="#fff" backgroundColor="#333">
				<CDBSidebarHeader
					prefix={<i className="fa fa-bars fa-large"></i>}
				>
					<a
						href="/"
						className="text-decoration-none"
						style={{color: "inherit"}}
					>
						Sidebar
					</a>
				</CDBSidebarHeader>

				<CDBSidebarContent className="sidebar-content">
					<CDBSidebarMenu>
						<NavLink exact to="/" activeClassName="activeClicked">
							<CDBSidebarMenuItem icon="columns">
								Dashboard
							</CDBSidebarMenuItem>
						</NavLink>
						<NavLink
							exact
							to="/tables"
							activeClassName="activeClicked"
						>
							<CDBSidebarMenuItem icon="table">
								Tables
							</CDBSidebarMenuItem>
						</NavLink>
						<NavLink
							exact
							to="/profile"
							activeClassName="activeClicked"
						>
							<CDBSidebarMenuItem icon="user">
								Profile page
							</CDBSidebarMenuItem>
						</NavLink>
						<NavLink
							exact
							to="/analytics"
							activeClassName="activeClicked"
						>
							<CDBSidebarMenuItem icon="chart-line">
								Analytics
							</CDBSidebarMenuItem>
						</NavLink>

						<NavLink
							exact
							to="/hero404"
							target="_blank"
							activeClassName="activeClicked"
						>
							<CDBSidebarMenuItem icon="exclamation-circle">
								404 page
							</CDBSidebarMenuItem>
						</NavLink>
					</CDBSidebarMenu>
				</CDBSidebarContent>

				<CDBSidebarFooter style={{textAlign: "center"}}>
					<div
						style={{
							padding: "20px 5px"
						}}
					>
						Sidebar Footer
					</div>
				</CDBSidebarFooter>
			</CDBSidebar>
		</div>
	);
};

export default AdminNavbar;
