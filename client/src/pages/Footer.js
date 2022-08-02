import style from "../style/Footer.module.css";

import twitter_logo from "../images/logos/twitter.png";
import discord_logo from "../images/logos/discord.png";
import instagram_logo from "../images/logos/instagram.png";

function Footer() {
	return (
		<footer className={style.footer} id="footer">
			<div className={style.horizontal_div_footer} hidden>
				<img src={twitter_logo} alt="twitter logo" />
				<img src={discord_logo} alt="discord logo" />
				<img src={instagram_logo} alt="instagram logo" />
			</div>
			<div className={style.horizontal_div_footer}>
				<div>CC COPYRIGHT TOUSSA</div>
				<div> HOSTED BY US </div>
			</div>
			<div className={style.horizontal_div_footer}>
				<a href="/legalthings"> CGU </a>
				<a href="/dollarthings"> CGV </a>
				<a href="/contact"> Contact us grand fou</a>
			</div>
		</footer>
	);
}

export default Footer;
