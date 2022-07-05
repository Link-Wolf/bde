import {NavDropdown} from "react-bootstrap";
import {useEffect, useState} from "react";
import user_picture from "../images/user_placeholder.png";

const UserDropDown = data => {
	const [img, setImg] = useState(user_picture);
	useEffect(() => {
		console.log(data.user);
	}, [data]);

	return (
		<NavDropdown title={<img width="30" height="30" src={img} />}>
			<NavDropdown.Item href="/me">Profile</NavDropdown.Item>
			<NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
			<NavDropdown.Item href={global.config.intra.redirect}>
				Login
			</NavDropdown.Item>
		</NavDropdown>
	);
};

export default UserDropDown;
