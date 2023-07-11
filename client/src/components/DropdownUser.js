import {useState, useEffect} from "react";
import {NotificationManager} from "react-notifications";

import login from "../assets/logos/login.png";
import logout from "../assets/logos/logout.png";
import blank from "../assets/placeholders/tmp_profile.png";

import style from "../style/Header.module.scss";

/**
 * @brief      Component that display the user profile picture and the login/logout button depending on the user's state
 */
const DropdownUser = param => {
	const [img, setImg] = useState({
		profile: undefined,
		login: blank,
		logout: blank
	});

	/**
	 * @brief      Fetch the user's profile picture and data then set the state accordingly
	 */
	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/session`, {
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
				NotificationManager.error(
					"Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
					"Erreur",
					5000
				);
			});
	}, []);

	if (img.profile == undefined) return;
	if (img.profile !== blank)
		return (
			<div>
				<a href={"/me"}>
					{param.mobile ? (
						<h1> Profil </h1>
					) : (
						<img alt=""
							src={
								img.profile !== blank ? img.profile : img.login
							}
						/>
					)}
				</a>

				<a href="/log">
					{param.mobile ? (
						<h1> Logout </h1>
					) : (
						<img alt="" id={style.logout} src={img.logout} height="3vh" />
					)}
				</a>
			</div>
		);
	return (
		<a
			href={process.env.REACT_APP_INTRA_REDIRECT}
			onClick={() => {
				localStorage.setItem("toRedirectLogin", window.location);
			}}
		>
			<h1>Login</h1>
		</a>
	);
};

export default DropdownUser;
