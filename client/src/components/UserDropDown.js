import {NavDropdown} from "react-bootstrap";
import {useEffect} from "react";
import user_picture from "../images/user_placeholder.png";

const UserDropDown = data => {
	useEffect(() => {}, []);

	return (
		<NavDropdown title={<img width="30" height="30" src={user_picture} />}>
			<NavDropdown.Item href="/me">Profile</NavDropdown.Item>
			<NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
			<NavDropdown.Item href={global.config.intra.redirect}>
				Login
			</NavDropdown.Item>
		</NavDropdown>
	);
};

export default UserDropDown;
