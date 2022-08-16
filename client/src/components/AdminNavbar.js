import React, {useState, useEffect} from "react";
import {Nav} from "react-bootstrap";
import {
	CDBSidebar,
	CDBSidebarContent,
	CDBSidebarHeader,
	CDBSidebarMenu,
	CDBSidebarMenuItem
} from "cdbreact";

const AdminNavbar = () => {
	const [clearance, setClearance] = useState(-42);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [footerHeight, setFooterHeight] = useState(0);

	useEffect(() => {
		fetch(`http://${global.config.api.authority}/session`, {
			credentials: "include"
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`
					);
				}
				return response.json();
			})
			.then(data => {
				if (data.clearance !== -42) setClearance(data.clearance);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " +
						error.message
				);
			});
	}, []);

	useEffect(() => {
		if (document.getElementById("header"))
			setHeaderHeight(document.getElementById("header").offsetHeight);
		if (document.getElementById("footer"))
			setFooterHeight(document.getElementById("footer").offsetHeight);
	}, []);

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
						<Nav.Link href="/admin/shop">
							<CDBSidebarMenuItem>Shop</CDBSidebarMenuItem>
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
