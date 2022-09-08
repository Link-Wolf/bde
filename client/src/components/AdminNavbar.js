import React, {useState, useEffect} from "react";
import {Nav} from "react-bootstrap";
import {Button} from "reactstrap";
import {
	CDBSidebar,
	CDBSidebarContent,
	CDBSidebarHeader,
	CDBSidebarMenu,
	CDBSidebarMenuItem
} from "cdbreact";

const AdminNavbar = () => {
	const [captainLink, setCaptainLink] = useState(<></>);
	const [initDbButton, setInitDbButton] = useState(<></>);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [footerHeight, setFooterHeight] = useState(0);

	useEffect(() => {
		const initDb = async () => {
			await fetch(`http://${global.config.api.authority}/stud`, {
				headers: {"Content-Type": "application/json"},
				method: "POST",
				credentials: "include",
				body: JSON.stringify({
					login: "iCARUS",
					firstname: "###",
					lastname: "azphael",
					isDirection: true,
					clearance: 42
				})
			})
				.then(() => {
					fetch(`http://${global.config.api.authority}/stud`, {
						headers: {"Content-Type": "application/json"},
						method: "POST",
						credentials: "include",
						body: JSON.stringify({
							login: "Link",
							firstname: "xxxxx",
							lastname: "xxxxxx",
							isDirection: true,
							clearance: 42
						})
					});
				})
				.then(() => {
					fetch(`http://${global.config.api.authority}/stud`, {
						headers: {"Content-Type": "application/json"},
						method: "POST",
						credentials: "include",
						body: JSON.stringify({
							login: "yoyostud",
							firstname: "yohan",
							lastname: "tollet",
							isDirection: false,
							clearance: 7
						})
					});
				})
				.then(() => {
					fetch(`http://${global.config.api.authority}/goodies`, {
						headers: {"Content-Type": "application/json"},
						method: "POST",
						credentials: "include",
						body: JSON.stringify({
							name: "42 Mulhouse Hoodie Premium+",
							cost: 40,
							desc:
								"Oui bonjour c'est le sweet ultra premium qu'a l'air sympa",
							available: true
						})
					});
				})
				.then(() => {
					fetch(`http://${global.config.api.authority}/goodies`, {
						headers: {"Content-Type": "application/json"},
						method: "POST",
						credentials: "include",
						body: JSON.stringify({
							name: "Casquette noire BDE",
							cost: 10,
							desc: "Casquette avec logo 42 mulhouse",
							available: true
						})
					});
				})
				.then(() => {
					fetch(`http://${global.config.api.authority}/goodies`, {
						headers: {"Content-Type": "application/json"},
						method: "POST",
						credentials: "include",
						body: JSON.stringify({
							name: "42 Mulhouse T Shirt noir",
							cost: 15,
							desc:
								"T shirt noir 42 mulhouse logo coeur + pas dos",
							available: 0
						})
					});
				})
				.then(() => {
					fetch(`http://${global.config.api.authority}/event`, {
						headers: {"Content-Type": "application/json"},
						method: "POST",
						credentials: "include",
						body: JSON.stringify({
							name: "Loup Garou",
							cost: 5,
							premium_cost: 3,
							nb_places: 15,
							begin_date: "06-13-2022",
							end_date: "06-13-2022",
							desc:
								"L'uwu garou du vendredi matin en jeu de cartes",
							place: "cantina",
							isOutside: false,
							consos: true,
							for_pool: true,
							available: false,
							sponso: false,
							thumbnail_filename:
								"assets/thumbnails/events/1.jpeg"
						})
					});
				})
				.then(() => {
					fetch(`http://${global.config.api.authority}/event`, {
						headers: {"Content-Type": "application/json"},
						method: "POST",
						credentials: "include",
						body: JSON.stringify({
							name: "Tournoi Echecs",
							cost: 0,
							nb_places: -42,
							begin_date: "06-13-2022",
							end_date: "06-14-2023",
							place: "cantina",
							isOutside: false,
							consos: true,
							for_pool: false,
							available: false,
							sponso: false,
							thumbnail_filename:
								"assets/thumbnails/events/2.jpeg"
						})
					});
				})
				.then(() => {
					fetch(`http://${global.config.api.authority}/event`, {
						headers: {"Content-Type": "application/json"},
						method: "POST",
						credentials: "include",
						body: JSON.stringify({
							name: "Ventriglisse",
							cost: 15,
							nb_places: 50,
							begin_date: "06-13-2022",
							place: "Derriere 42",
							desc:
								"Ventriglisse sur nos corps huilés et musculeux",
							isOutside: false,
							consos: true,
							for_pool: false,
							available: true,
							sponso: false,
							thumbnail_filename:
								"assets/thumbnails/events/3.jpeg"
						})
					});
				})
				.then(() => {
					fetch(`http://${global.config.api.authority}/event`, {
						headers: {"Content-Type": "application/json"},
						method: "POST",
						credentials: "include",
						body: JSON.stringify({
							name: "Laser game",
							cost: 7,
							premium_cost: 5,
							nb_places: 19,
							begin_date: "06-13-2022",
							end_date: "06-15-2022",
							place: "42 rue de la norminette 69420 Mulhouse",
							desc: "piou piou avec des lasers",
							isOutside: true,
							consos: false,
							for_pool: true,
							available: false,
							sponso: false,
							thumbnail_filename:
								"assets/thumbnails/events/4.jpeg"
						})
					});
				})
				.then(() => {
					fetch(
						`http://${global.config.api.authority}/contribution`,
						{
							headers: {"Content-Type": "application/json"},
							method: "POST",
							credentials: "include",
							body: JSON.stringify({
								studLogin: "yoyostud"
							})
						}
					);
				})
				.then(() => {
					fetch(
						`http://${global.config.api.authority}/contribution`,
						{
							headers: {"Content-Type": "application/json"},
							method: "POST",
							credentials: "include",
							body: JSON.stringify({
								studLogin: "Link",
								begin_date: "12-12-2022"
							})
						}
					);
				});
		};
		const tiniDb = async () => {
			fetch(`http://${global.config.api.authority}/stud`, {
				credentials: "include",
				method: "DELETE"
			})
				.then(() => {
					fetch(`http://${global.config.api.authority}/event`, {
						credentials: "include",
						method: "DELETE"
					});
				})
				.then(() => {
					fetch(`http://${global.config.api.authority}/goodies`, {
						credentials: "include",
						method: "DELETE"
					});
				})
				.then(() => {
					fetch(`http://${global.config.api.authority}/inscription`, {
						credentials: "include",
						method: "DELETE"
					});
				})
				.then(() => {
					fetch(
						`http://${global.config.api.authority}/contribution`,
						{
							credentials: "include",
							method: "DELETE"
						}
					);
				});
		};

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
				if (data.clearance >= 21)
					setCaptainLink(
						<Nav.Link href="/admin/teammanagement">
							<CDBSidebarMenuItem>Management</CDBSidebarMenuItem>
						</Nav.Link>
					);
				if (data.clearance >= 42)
					setInitDbButton(
						<>
							<Button color="warning" onClick={initDb}>
								Init DB
							</Button>
							<Button color="danger" onClick={tiniDb}>
								Yeet DB
							</Button>
						</>
					);
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
						{captainLink}
						{initDbButton}
					</CDBSidebarMenu>
				</CDBSidebarContent>
			</CDBSidebar>
		</div>
	);
};

export default AdminNavbar;
