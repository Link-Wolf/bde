import {Navbar, Nav, NavDropdown, Container} from "react-bootstrap";

import bde_logo from "../images/bde_logo.webp";
import user_picture from "../images/user_placeholder.png";

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
					<NavDropdown
						title={
							<img width="30" height="30" src={user_picture} />
						}
					>
						<NavDropdown.Item href="/me">Profile</NavDropdown.Item>
						<NavDropdown.Item href="/settings">
							Settings
						</NavDropdown.Item>
						<NavDropdown.Item href={global.config.intra.redirect}>
							Login
						</NavDropdown.Item>
					</NavDropdown>
				</Nav>
			</Container>
		</Navbar>
	);
}

export default Header;
