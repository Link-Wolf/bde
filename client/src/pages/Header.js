import {Navbar, Nav, Container} from "react-bootstrap";
import {useState, useEffect} from "react";
import {LazyLoadImage} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import DropdownUser from "../components/DropdownUser";

import bde_logo from "../assets/logos/bde_logo.jpeg";

function Header() {
	const [leftButton, setLeftButton] = useState(<></>);
	const [rightButton, setRightButton] = useState(<></>);

	const [isShrunk, setShrunk] = useState(false);

	useEffect(() => {
		const handler = () => {
			setShrunk(isShrunk => {
				if (
					!isShrunk &&
					(document.body.scrollTop > 20 ||
						document.documentElement.scrollTop > 20)
				) {
					return true;
				}

				if (
					isShrunk &&
					document.body.scrollTop < 4 &&
					document.documentElement.scrollTop < 4
				) {
					return false;
				}

				return isShrunk;
			});
		};

		window.addEventListener("scroll", handler);
		return () => window.removeEventListener("scroll", handler);
	}, []);

	useEffect(() => {
		setTimeout(() => {
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
					if (data.clearance === global.config.clearance.default) {
						setLeftButton(
							<Nav className="me-auto">
								<Nav.Link href="/shop">Shop</Nav.Link>
								<Nav.Link href="/contact">Contact</Nav.Link>
								<Nav.Link href="/about">About Us</Nav.Link>
							</Nav>
						);
					}
					if (data.clearance > global.config.clearance.default) {
						setLeftButton(
							<Nav className="me-auto">
								<Nav.Link href="/events">Events</Nav.Link>
								<Nav.Link href="/clubs">Clubs</Nav.Link>
								<Nav.Link href="/shop">Shop</Nav.Link>
								<Nav.Link href="/contact">Contact</Nav.Link>
								<Nav.Link href="/about">About Us</Nav.Link>
							</Nav>
						);
					}
					if (data.clearance >= global.config.clearance.admin) {
						setRightButton(
							<Nav.Link href="/admin">Admin</Nav.Link>
						);
					}
				})
				.catch(function(error) {
					console.log(
						"Il y a eu un problème avec l'opération fetch: " +
							error.message
					);
				});
		}, 100);
	}, []);

	return (
		<Navbar
			sticky="top"
			collapseOnSelect
			bg="dark"
			variant="dark"
			id="header"
			style={{
				transition: "0.5s"
			}}
			className={isShrunk ? "py-2" : "py-5"}
		>
			<Container>
				<Navbar.Brand href="/home">
					<LazyLoadImage
						height="30"
						src={bde_logo}
						width="30"
						effect="blur"
						className="d-inline-block align-top"
					/>
					<Navbar.Text> La Fregate</Navbar.Text>
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
