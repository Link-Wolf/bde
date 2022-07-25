import {Navbar, Nav, Container} from "react-bootstrap";
import {useState, useEffect} from "react";
import DropdownUser from "../components/DropdownUser";

import bde_logo from "../images/bde_logo.webp";

function Header() {
	const [clearance, setClearance] = useState(-42);
	const [leftButton, setLeftButton] = useState(<></>);
	const [rightButton, setRightButton] = useState(<></>);

	useEffect(() => {
		let clear = undefined;// TODO: fetch clearance
		if (clear === undefined) clear = 0;
		setClearance(clear);
	}, []);

	useEffect(() => {
		if (clearance != -42) {
			if (clearance == 0) {
				setLeftButton(
					<Nav className="me-auto">
						<Nav.Link href="/showcase">Events</Nav.Link>
					</Nav>
				);
			}
			if (clearance > 0) {
				setLeftButton(
					<Nav className="me-auto">
						<Nav.Link href="/events">Events</Nav.Link>
						<Nav.Link href="/shop">Shop</Nav.Link>
					</Nav>
				);
			}
			if (clearance >= 3) {
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
