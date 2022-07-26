import {Navbar, Nav, Container} from "react-bootstrap";
import {useState, useEffect} from "react";
import DropdownUser from "../components/DropdownUser";

import bde_logo from "../images/bde_logo.webp";

function Header() {
	const [clearance, setClearance] = useState(-42);
	const [leftButton, setLeftButton] = useState(<></>);
	const [rightButton, setRightButton] = useState(<></>);

	useEffect(() => {
		fetch(`http://localhost:4242/session`, {
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
				if (data.clearance != -42) setClearance(data.clearance);
			})
			.catch(function(error) {
				console.log(
					"Il y a eu un problème avec l'opération fetch: " + error.message
				);
			});
	}, []);

	useEffect(() => {
		if (clearance != -42) {
			if (clearance == global.config.clearance.default) {
				setLeftButton(
					<Nav className="me-auto">
						<Nav.Link href="/shop">Shop</Nav.Link>
						<Nav.Link href="/contact">Contact</Nav.Link>
					</Nav>
				);
			}
			if (clearance > global.config.clearance.default) {
				setLeftButton(
					<Nav className="me-auto">
						<Nav.Link href="/events">Events</Nav.Link>
						<Nav.Link href="/shop">Shop</Nav.Link>
						<Nav.Link href="/contact">Contact</Nav.Link>
					</Nav>
				);
			}
			if (clearance >= global.config.clearance.admin) {
				setRightButton(<Nav.Link href="/admin">Admin</Nav.Link>);
			}
		}
	}, [clearance]);

	return (
		<Navbar sticky="top" collapseOnSelect bg="dark" variant="dark">
			<Container>
				<Navbar.Brand href="/home">
					<img
						height="30"
						width="30"
						className="d-inline-block align-top"
						src={bde_logo}
					/>
					<Navbar.Text>Fregate</Navbar.Text>
				</Navbar.Brand>
				{leftButton}
				<Nav>
					{rightButton}
					<DropdownUser />
				</Nav>
			</Container>
		</Navbar>
	);
}

export default Header;
