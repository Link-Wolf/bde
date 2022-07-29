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
				height: `calc(100vh - (${
					document.getElementById("header").offsetHeight
				}px + ${document.getElementById("footer").offsetHeight}px))`,
				position: "sticky",
				top: `${document.getElementById("header").offsetHeight}px`
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
						<Nav.Link href="/admin/students">
							<CDBSidebarMenuItem>Students</CDBSidebarMenuItem>
						</Nav.Link>
						<Nav.Link href="/admin/events/gestion">
							<CDBSidebarMenuItem>Events</CDBSidebarMenuItem>
						</Nav.Link>
						<Nav.Link href="/admin/events/subscribtions">
							<CDBSidebarMenuItem>
								Inscriptions
							</CDBSidebarMenuItem>
						</Nav.Link>
						<Nav.Link href="/admin/contributions">
							<CDBSidebarMenuItem>Cotisations</CDBSidebarMenuItem>
						</Nav.Link>
						<Nav.Link href="/admin/logs">
							<CDBSidebarMenuItem>Logs</CDBSidebarMenuItem>
						</Nav.Link>
						<Nav.Link href="/admin/teammanagement">
							<CDBSidebarMenuItem>Management</CDBSidebarMenuItem>
						</Nav.Link>
					</CDBSidebarMenu>
				</CDBSidebarContent>
			</CDBSidebar>
		</div>
	);
};

export default AdminNavbar;
