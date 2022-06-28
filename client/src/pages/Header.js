import Dropdown from "../components/Dropdown";

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
			<a href="/events">
				<button> Events </button>
			</a>
			<a href="/shop">
				<button> Shop </button>
			</a>
			<Dropdown title="User" id={style.loginButton}>
				<a href="/me"> Profile </a>
				<a href="/settings"> Settings </a>
				<a href="/log"> Login/Logout </a>
			</Dropdown>
			<a href="/admin">
				<button> Admin </button>
			</a>
		</header>
	);
}

export default Header;
