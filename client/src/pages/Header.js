import Dropdown from "../components/Dropdown";

import user_placeholder from "../images/user_placeholder.png";
import bde_logo from "../images/bde_logo.webp";

import style from "../style/Header.module.css";

window.onscroll = function() {
	scrollFunction();
};

function scrollFunction() {
	if (
		document.body.scrollTop > 50 ||
		document.documentElement.scrollTop > 50
	) {
		document.documentElement.style.setProperty("--header_height", "5vw");
	} else {
		document.documentElement.style.setProperty("--header_height", "10vw");
	}
}

function Header() {
	return (
		<header className={style.header} id="header">
			<a href="/home">
				<img id={style.bde_logo} src={bde_logo} />
			</a>
			<button href="/events"> Events </button>
			<button href="/shop"> Shop </button>
			<Dropdown bg={user_placeholder} title>
				<a href="/me"> Profile </a>
				<a href="/settings"> Settings </a>
				<a href="/log"> Login/Logout </a>
			</Dropdown>
		</header>
	);
}

export default Header;
