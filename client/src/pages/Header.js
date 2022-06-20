import {
	Nav,
	Navbar,
	Container,
	NavDropdown,
	Form,
	FormControl,
	Button
} from "react-bootstrap";

import user_placeholder from "./images/user_placeholder.png";

import "../style/Header.css";

function Header() {
	return (
		<header>
			<Navbar bg="light" expand="lg">
				<Container>
					<Navbar.Brand href="home">BDE</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="me-auto">
							<Nav.Link href="event">Events</Nav.Link>
							<Nav.Link href="shop">Shop</Nav.Link>
							<NavDropdown
								title={
									<img
										src={user_placeholder}
										alt="user pp placeholder"
									/>
								}
								id="basic-nav-dropdown"
							>
								<NavDropdown.Item href="me">
									Profile
								</NavDropdown.Item>
								<NavDropdown.Item href="settings">
									Settings
								</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item href="log">
									Login / Logout
								</NavDropdown.Item>
							</NavDropdown>
						</Nav>
						<Form className="d-flex">
							<FormControl
								type="search"
								placeholder="Search"
								className="me-2"
								aria-label="Search"
							/>
							<Button variant="outline-success">Search</Button>
						</Form>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
}

export default Header;
