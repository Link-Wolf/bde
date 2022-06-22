import {
	Nav,
	Navbar,
	Container,
	NavDropdown,
	Form,
	FormControl,
	Button
} from "react-bootstrap";

import user_placeholder from "../images/user_placeholder.png";
import bde_logo from "../images/bde_logo.webp";

import style from "../style/Header.module.css";

function Header() {
	return (
		<header className={style.header}>
			<Navbar bg="dark" variant="dark">
				<Container>
					<Navbar.Brand href="/home">
						<img
							className={style.img}
							id={style.bde_logo}
							src={bde_logo}
							alt="logo bde"
						/>
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="me-auto">
							<Nav.Link href="/events">Events</Nav.Link>
							<Nav.Link href="/shop">Shop</Nav.Link>
							<Nav.Link href="/stud">Stud</Nav.Link>
							<NavDropdown
								title={
									<img
										className={style.img}
										src={user_placeholder}
										alt="user pp placeholder"
									/>
								}
								id="basic-nav-dropdown"
							>
								<NavDropdown.Item href="/me">
									Profile
								</NavDropdown.Item>
								<NavDropdown.Item href="/settings">
									Settings
								</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item href="/log">
									Login / Logout
								</NavDropdown.Item>
							</NavDropdown>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
}

export default Header;
