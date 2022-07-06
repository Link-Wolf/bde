import {Navbar, Nav, Container} from "react-bootstrap";
import {ReactSession} from "react-client-session";
import {useState, useEffect} from "react";

import DropdownUser from "../components/DropdownUser";

import bde_logo from "../images/bde_logo.webp";
import user_picture from "../images/user_placeholder.png";

function Header() {
	const [img, setImg] = useState(user_picture);

	useEffect(() => {
		try {
			const localimg = ReactSession.get("image_url");
			if (localimg === "") setImg(user_picture);
			else setImg(localimg);
		} catch {
			setImg(user_picture);
		}
	}, []);

	useEffect(() => {}, [img]);

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
