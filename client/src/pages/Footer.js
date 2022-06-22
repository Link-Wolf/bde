import style from "../style/Footer.module.css";

import twitter_logo from "../images/twitter_logo.png";
import discord_logo from "../images/discord_logo.png";
import instagram_logo from "../images/instagram_logo.png";

function Footer() {
	return (
		<footer>
			<div className="horizontal_div_footer">
				<img contain src={twitter_logo} alt="twitter logo" />
				<img contain src={discord_logo} alt="discord logo" />
				<img contain src={instagram_logo} alt="instagram logo" />
			</div>
			<div className="horizontal_div_footer">
				<div>CC COPYRIGHT TOUSSA</div>
				<div> HOSTED BY US </div>
			</div>
			<div className="horizontal_div_footer">
				<div> CGU / CGV</div>
				<div> Contact us grand fou</div>
			</div>
		</footer>
	);
}

export default Footer;
