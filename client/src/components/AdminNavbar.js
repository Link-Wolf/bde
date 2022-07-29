import React from "react";
import {Navbar, Nav, NavDropdown} from "react-bootstrap";
import {
	CDBSidebar,
	CDBSidebarContent,
	CDBSidebarFooter,
	CDBSidebarHeader,
	CDBSidebarMenu,
	CDBSidebarMenuItem
} from "cdbreact";
import {NavLink} from "react-router-dom";

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
				<CDBSidebarHeader>
					<a
						href="/admin"
						className="text-decoration-none"
						style={{color: "inherit"}}
					>
						Admin pannel
					</a>
				</CDBSidebarHeader>

				<CDBSidebarContent className="sidebar-content">
					<CDBSidebarMenu>
						<NavLink
							exact
							to="/admin/students"
							activeClassName="activeClicked"
						>
							<CDBSidebarMenuItem>Students</CDBSidebarMenuItem>
						</NavLink>
						<NavLink
							exact
							to="/admin/events/gestion"
							activeClassName="activeClicked"
						>
							<CDBSidebarMenuItem>Events</CDBSidebarMenuItem>
						</NavLink>
						<NavLink
							exact
							to="/admin/events/subscribtions"
							activeClassName="activeClicked"
						>
							<CDBSidebarMenuItem>
								Inscriptions
							</CDBSidebarMenuItem>
						</NavLink>
						<NavLink
							exact
							to="/admin/contributions"
							activeClassName="activeClicked"
						>
							<CDBSidebarMenuItem>Cotisations</CDBSidebarMenuItem>
						</NavLink>
						<NavLink
							exact
							to="/admin/logs"
							activeClassName="activeClicked"
						>
							<CDBSidebarMenuItem>Logs</CDBSidebarMenuItem>
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
