import {useState, useEffect} from "react";

import login from "../assets/logos/login.png";
import logout from "../assets/logos/logout.png";
import blank from "../assets/placeholders/tmp_profile.png";

import style from "../style/Header.module.scss";

const DropdownUser = () => {
	const [img, setImg] = useState({
		profile: blank,
		login: blank,
		logout: blank
	});

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
					let profile = blank;
					if (data.image_url !== -42) profile = data.image_url;
					setImg({
						profile: profile,
						login: login,
						logout: logout
					});
				})
				.catch(function(error) {
					console.log(
						"Il y a eu un problème avec l'opération fetch: " +
							error.message
					);
				});
		}, 100);
	}, []);

	if (img.profile !== blank)
		return (
			<div>
				<a href="/log">
					<img id={style.logout} src={img.logout} height="3vh" />
				</a>
				<a href={"/me"}>
					<img
						src={img.profile !== blank ? img.profile : img.login}
					/>
				</a>
			</div>
		);
	return (
		<a href={global.config.intra.redirect}>
			<h1>Login</h1>
		</a>
	);
};

export default DropdownUser;
