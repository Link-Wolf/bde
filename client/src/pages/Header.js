import {useState, useEffect} from "react";
import {LazyLoadImage} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import DropdownUser from "../components/DropdownUser";

import style from "../style/Header.module.scss";

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
							<>
								<a href="/shop">
									<h1>Shop</h1>
								</a>
								<a href="/contact">
									<h1>Contact</h1>
								</a>
							</>
						);
					}
					if (data.clearance > global.config.clearance.default) {
						setLeftButton(
							<>
								<a href="/events">
									<h1>Events</h1>
								</a>
								<a href="/clubs">
									<h1>Clubs</h1>
								</a>
								<a href="/shop">
									<h1>Shop</h1>
								</a>
								<a href="/contact">
									<h1>Contact</h1>
								</a>
							</>
						);
					}
					if (data.clearance >= global.config.clearance.admin) {
						setRightButton(
							<a href="/admin">
								<h1>Admin</h1>
							</a>
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
		<header className={style.container}>
			<div className={style.leftContainer}>
				<div>
					<a className={style.logoContainer} href="/home">
						<LazyLoadImage
							src={bde_logo}
							effect="blur"
							className="d-inline-block align-top"
						/>
						<h1>La Fregate</h1>
					</a>
				</div>
				<div className={style.buttonContainer}>{leftButton}</div>
			</div>
			<div className={style.rightContainer}>
				<div>{rightButton}</div>
				<DropdownUser />
			</div>
		</header>
	);
}

export default Header;
