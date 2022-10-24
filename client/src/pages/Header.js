import {useState, useEffect} from "react";
import {LazyLoadImage} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import burger from "../assets/logos/burger.png";

import DropdownUser from "../components/DropdownUser";

import style from "../style/Header.module.scss";

import bde_logo from "../assets/logos/fregate_white.png";

function Header() {
	const [leftButton, setLeftButton] = useState(<></>);
	const [rightButton, setRightButton] = useState(<></>);

	useEffect(() => {
		setTimeout(() => {
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
					if (data.clearance === global.config.clearance.default) {
						setLeftButton(
							<>
								<a href="/contact">
									<h1>Contact</h1>
								</a>
							</>
						);
					}
					if (data.clearance > global.config.clearance.default) {
						setLeftButton(
							<>
								<a href="/clubs">
									<h1>Clubs</h1>
								</a>
								<a href="/contact">
									<h1>Contact</h1>
								</a>
							</>
						);
					}
					if (data.clearance >= global.config.clearance.admin) {
						setRightButton(
							<a href="/admin" className={style.hrbefore}>
								<hr />
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

	const toggleBurgerMenu = () => {
		if (document.getElementById(style.burgerMenu).style.left === "0px") {
			document.getElementById(style.burgerMenu).style.width = "0";
			document.getElementById(style.burgerMenu).style.left = "100vw";
			document.getElementById(style.burgerMenu).style.padding = "0";
		} else {
			document.getElementById(style.burgerMenu).style.left = "0";
			document.getElementById(style.burgerMenu).style.width = "100vw";
			document.getElementById(style.burgerMenu).style.padding =
				" 0 0 0 40px";
		}
	};

	return (
		<header className={style.container}>
			<div className={`${style.burger}`} id={style.burgerMenu}>
				<div id={style.x}>
					<a onClick={toggleBurgerMenu}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 14 14"
						>
							<g>
								<line
									x1={13.5}
									y1={0.5}
									x2={0.5}
									y2={13.5}
									fill="none"
									stroke="var(--white)"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<line
									x1={0.5}
									y1={0.5}
									x2={13.5}
									y2={13.5}
									fill="none"
									stroke="var(--white)"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</g>
						</svg>
					</a>
				</div>
				{leftButton}
				{rightButton}
				<hr />

				<DropdownUser mobile />
			</div>

			<div className={style.leftContainer}>
				<div>
					<a className={style.logoContainer} href="/home">
						<img
							src={bde_logo}
							className="d-inline-block align-top"
						/>
						<h1>La Frégate</h1>
					</a>
				</div>
				<div className={style.buttonContainer}>{leftButton}</div>
			</div>
			<div className={style.rightContainer}>
				<div className={style.admin}>{rightButton}</div>
				<div className={`${style.dropdownContainer}`}>
					<DropdownUser />
				</div>
				<div className={style.burger}>
					<img src={burger} onClick={toggleBurgerMenu} />
				</div>
			</div>
		</header>
	);
}

export default Header;
