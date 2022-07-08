import {NavDropdown} from "react-bootstrap";
import {ReactSession} from "react-client-session";
import {useState, useEffect} from "react";

import user_picture from "../images/user_placeholder.png";

const DropdownUser = () => {
	const [img, setImg] = useState(user_picture);
	const [ret, setRet] = useState(<></>);

	useEffect(() => {
		const localimg = ReactSession.get("image_url");
		if (localimg == undefined) setImg(user_picture);
		else setImg(localimg);
	}, []);

	useEffect(() => {
		if (img != user_picture)
			setRet(
				<NavDropdown title={<img width="30" height="30" src={img} />}>
					<NavDropdown.Item href="/me">Profile</NavDropdown.Item>
					<NavDropdown.Item href="/settings">
						Settings
					</NavDropdown.Item>
					<NavDropdown.Item href="/log">Logout</NavDropdown.Item>
				</NavDropdown>
			);
		else
			setRet(
				<NavDropdown title={<img width="30" height="30" src={img} />}>
					<NavDropdown.Item href={global.config.intra.redirect}>
						Login
					</NavDropdown.Item>{" "}
				</NavDropdown>
			);
	}, [img]);

	return ret;
};

export default DropdownUser;
