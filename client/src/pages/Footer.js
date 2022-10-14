import style from "../style/Footer.module.scss";

import twitter_logo from "../assets/logos/twitter.png";
import discord_logo from "../assets/logos/discord.png";
import instagram_logo from "../assets/logos/instagram.png";

import {LazyLoadImage} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function Footer() {
	return (
		<footer className={style.footer} id="footer">
			<div>
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
			<div className={style.credits}>
				<div>
					<div>
						{" "}
						Hosted by{" "}
						<a href="42mulhouse.fr">
							<b>42 Mulhouse</b>
						</a>
					</div>
				</div>
				<div>© 2022 BDE 42 Mulhouse, tous droits réservés</div>
				<div>
					<a href="/legalthings"> Mentions légales</a>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
