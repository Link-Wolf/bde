import {Navbar, Nav, Container} from "react-bootstrap";
import {useEffect} from "react";

import DropdownUser from "../components/DropdownUser";

import bde_logo from "../images/bde_logo.webp";

function Header() {
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
				<Nav className="me-auto">
					<Nav.Link href="/events">Events</Nav.Link>
					<Nav.Link href="/shop">Shop</Nav.Link>
				</Nav>
				<Nav>
					<Nav.Link href="/admin">Admin</Nav.Link>
					<DropdownUser />
				</Nav>
			</Container>
		</Navbar>
	);
}

export default Header;
