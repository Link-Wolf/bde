import style from "../style/Footer.module.css";

import twitter_logo from "../assets/logos/twitter.png";
import discord_logo from "../assets/logos/discord.png";
import instagram_logo from "../assets/logos/instagram.png";

function Footer() {
	return (
		<footer className={style.footer} id="footer">
			<div className={style.horizontal_div_footer}>
				<img src={twitter_logo} alt="twitter logo" hidden />
				<img src={discord_logo} alt="discord logo" hidden />
				<a href="https://www.instagram.com/bde_42mulhouse/">
					<img src={instagram_logo} alt="instagram logo" />
				</a>
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
