import {NavDropdown} from "react-bootstrap";
import {useState, useEffect} from "react";
import {LazyLoadImage} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import user_picture from "../assets/placeholders/user_profile.png";
import tmp_picture from "../assets/placeholders/tmp_profile.png";

const DropdownUser = () => {
	const [img, setImg] = useState(tmp_picture);
	const [ret, setRet] = useState(
		<NavDropdown title={<LazyLoadImage src={img} effect="blur" />}>
			<NavDropdown.Item href={global.config.intra.redirect}>
				Login
			</NavDropdown.Item>
		</NavDropdown>
	);

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
					if (data.image_url !== -42) setImg(data.image_url);
					else setImg(user_picture);
				})
				.catch(function(error) {
					console.log(
						"Il y a eu un problème avec l'opération fetch: " +
							error.message
					);
				});
		}, 100);
	}, []);

	useEffect(() => {
		if (img !== tmp_picture) {
			if (img === user_picture) {
				setRet(
					<NavDropdown
						title={<LazyLoadImage src={img} effect="blur" />}
					>
						<NavDropdown.Item href={global.config.intra.redirect}>
							Login
						</NavDropdown.Item>
					</NavDropdown>
				);
			} else
				setRet(
					<NavDropdown
						title={<LazyLoadImage src={img} effect="blur" />}
					>
						{" "}
						<NavDropdown.Item href="/me">
							{" "}
							Profile{" "}
						</NavDropdown.Item>{" "}
						<NavDropdown.Item href="/log">
							{" "}
							Logout{" "}
						</NavDropdown.Item>{" "}
					</NavDropdown>
				);
		}
	}, [img]);

	return ret;
};

export default DropdownUser;
