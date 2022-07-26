import {
	NavDropdown
} from "react-bootstrap";
import {
	useState,
	useEffect
} from "react";

import user_picture from "../images/user_placeholder.png";

const DropdownUser = () => {
		const [img, setImg] = useState(user_picture);
		const [ret, setRet] = useState( < > < />);

				useEffect(() => {
					fetch(`http://localhost:4242/session`, {
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
							if (data.image_url != -42)
								setImg(data.image_url);
						})
						.catch(function(error) {
							console.log(
								"Il y a eu un problème avec l'opération fetch: " +
								error.message
							);
						});
				}, []);

				useEffect(() => {
						if (img != user_picture)
							setRet( <
								NavDropdown title = {
									<
									img width = "30"
									height = "30"
									src = {
										img
									}
									/>}> <
									NavDropdown.Item href = "/me" > Profile < /NavDropdown.Item> <
									NavDropdown.Item href = "/settings" >
									Settings <
									/NavDropdown.Item> <
									NavDropdown.Item href = "/log" > Logout < /NavDropdown.Item> < /
									NavDropdown >
								);
								else
									setRet( <
										NavDropdown title = {
											<
											img width = "30"
											height = "30"
											src = {
												img
											}
											/>}> <
											NavDropdown.Item href = {
												global.config.intra.redirect
											} >
											Login <
											/NavDropdown.Item> < /
											NavDropdown >
										);
									}, [img]);

						return ret;
					};

					export default DropdownUser;