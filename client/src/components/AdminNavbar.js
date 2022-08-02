import React, {useState, useEffect} from "react";
import {Nav} from "react-bootstrap";
import {
	CDBSidebar,
	CDBSidebarContent,
	CDBSidebarHeader,
	CDBSidebarMenu,
	CDBSidebarMenuItem
} from "cdbreact";

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
	const [headerHeight, setHeaderHeight] = useState(0);
	const [footerHeight, setFooterHeight] = useState(0);

	useEffect(() => {
		if (document.getElementById("header"))
			setHeaderHeight(document.getElementById("header").offsetHeight);
		if (document.getElementById("footer"))
			setHeaderHeight(document.getElementById("footer").offsetHeight);
	}, []);

	console.log(document.getElementById("header"));
	return (
		<div
			style={{
				display: "flex",
				height: `calc(100vh - (${headerHeight}px + ${footerHeight}px))`,
				position: "sticky",
				top: `${headerHeight}px`
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
