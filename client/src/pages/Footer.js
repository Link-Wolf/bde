import style from "../style/Footer.module.scss";

import twitter_logo from "../assets/logos/twitter.png";
import discord_logo from "../assets/logos/discord.png";
import instagram_logo from "../assets/logos/instagram.png";

function Footer() {
	return (
		<footer className={style.footer} id="footer">
			<div>
				<img alt=""
					height="auto"
					src={twitter_logo}
					width="auto"
					effect="blur"
					hidden
				/>
				<img alt=""
					height="auto"
					src={discord_logo}
					width="auto"
					effect="blur"
					hidden
				/>
				<a
					href="https://www.instagram.com/bde_42mulhouse/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img alt=""
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
						<a
							href="https://www.42mulhouse.fr"
							target="_blank"
							rel="noopener noreferrer"
						>
							42 Mulhouse
						</a>
					</div>
				</div>
				<div>© 2022 BDE 42 Mulhouse, tous droits réservés</div>
				<div>
					<a href="/legalthings"> Mentions légales</a>
				</div>
				<div className={style.version}>
					v{process.env.REACT_APP_VERSION}
				</div>
			</div>
		</footer>
	);
}

export default Footer;
