import style from "../style/Footer.module.css";

import twitter_logo from "../assets/logos/twitter.png";
import discord_logo from "../assets/logos/discord.png";
import instagram_logo from "../assets/logos/instagram.png";

import {LazyLoadImage} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function Footer() {
	return (
		<footer className={style.footer} id="footer">
			<div className={style.horizontal_div_footer}>
				<LazyLoadImage
					height="auto"
					src={twitter_logo}
					width="auto"
					effect="blur"
					hidden
				/>
				<LazyLoadImage
					height="auto"
					src={discord_logo}
					width="auto"
					effect="blur"
					hidden
				/>
				<a href="https://www.instagram.com/bde_42mulhouse/">
					<LazyLoadImage
						height="auto"
						src={instagram_logo}
						width="auto"
						effect="blur"
					/>
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
